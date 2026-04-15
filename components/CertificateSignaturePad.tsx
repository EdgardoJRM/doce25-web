'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

export type CertificateSignaturePadHandle = {
  getPngBytes: () => Promise<Uint8Array | null>
  isEmpty: () => boolean
  clear: () => void
}

function isCanvasBlank(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return true
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 24) return false
  }
  return true
}

type Props = {
  storageKey: string
  className?: string
  /** Se llama cuando hay o no trazo guardado (firma lista para descargar). */
  onSignatureChange?: (hasSignature: boolean) => void
}

const CertificateSignaturePad = forwardRef<CertificateSignaturePadHandle, Props>(
  function CertificateSignaturePad({ storageKey, className = '', onSignatureChange }, ref) {
    const wrapRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const drawing = useRef(false)
    const [ready, setReady] = useState(false)

    const layoutCanvas = useCallback(() => {
      const canvas = canvasRef.current
      const wrap = wrapRef.current
      if (!canvas || !wrap) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = wrap.getBoundingClientRect()
      const w = Math.max(1, Math.floor(width))
      const h = Math.max(1, Math.floor(height))
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = '#0f172a'
      ctx.lineWidth = 2.25
    }, [])

    const paintFromStorage = useCallback(() => {
      const canvas = canvasRef.current
      const wrap = wrapRef.current
      if (!canvas || !wrap) return
      let raw: string | null = null
      try {
        raw = sessionStorage.getItem(storageKey)
      } catch {
        return
      }
      if (!raw) {
        setReady(false)
        return
      }
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const { width, height } = wrap.getBoundingClientRect()
      const w = Math.max(1, width)
      const h = Math.max(1, height)
      const img = new Image()
      img.onload = () => {
        ctx.clearRect(0, 0, w, h)
        ctx.drawImage(img, 0, 0, w, h)
        setReady(!isCanvasBlank(canvas))
      }
      img.onerror = () => setReady(false)
      img.src = raw
    }, [storageKey])

    useEffect(() => {
      layoutCanvas()
      paintFromStorage()
      const el = wrapRef.current
      if (!el) return
      const ro = new ResizeObserver(() => {
        layoutCanvas()
        paintFromStorage()
      })
      ro.observe(el)
      return () => ro.disconnect()
    }, [layoutCanvas, paintFromStorage])

    useEffect(() => {
      onSignatureChange?.(ready)
    }, [ready, onSignatureChange])

    const getLocalCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return { x: 0, y: 0 }
      const r = canvas.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    const persist = () => {
      const canvas = canvasRef.current
      if (!canvas || isCanvasBlank(canvas)) return
      try {
        sessionStorage.setItem(storageKey, canvas.toDataURL('image/png'))
      } catch {
        /* quota */
      }
    }

    const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      drawing.current = true
      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx) return
      const { x, y } = getLocalCoords(e)
      ctx.beginPath()
      ctx.moveTo(x, y)
    }

    const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current) return
      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx) return
      const { x, y } = getLocalCoords(e)
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x, y)
      setReady(true)
    }

    const endDraw = () => {
      if (!drawing.current) return
      drawing.current = false
      const canvas = canvasRef.current
      if (canvas && !isCanvasBlank(canvas)) persist()
    }

    const clear = useCallback(() => {
      try {
        sessionStorage.removeItem(storageKey)
      } catch {
        /* ignore */
      }
      layoutCanvas()
      setReady(false)
    }, [storageKey, layoutCanvas])

    useImperativeHandle(
      ref,
      () => ({
        isEmpty: () => !canvasRef.current || isCanvasBlank(canvasRef.current),
        clear,
        getPngBytes: async () => {
          const canvas = canvasRef.current
          if (!canvas || isCanvasBlank(canvas)) return null
          const dataUrl = canvas.toDataURL('image/png')
          const res = await fetch(dataUrl)
          const buf = await res.arrayBuffer()
          return new Uint8Array(buf)
        },
      }),
      [clear]
    )

    return (
      <div className={className}>
        <div
          ref={wrapRef}
          className="relative w-full h-[11rem] md:h-36 rounded-lg border-2 border-dashed border-slate-300 bg-white overflow-hidden touch-none"
        >
          <canvas
            ref={canvasRef}
            className="block w-full h-full cursor-crosshair touch-none"
            onPointerDown={startDraw}
            onPointerMove={draw}
            onPointerUp={endDraw}
            onPointerLeave={endDraw}
          />
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between mt-2">
          <p className="text-xs text-slate-500 min-w-0 flex-1 leading-relaxed">
            {ready
              ? 'Firma lista — ya puedes descargar el certificado.'
              : 'Firma obligatoria para descargar: dibuja aquí (dedo o mouse).'}
          </p>
          <button
            type="button"
            onClick={clear}
            className="shrink-0 text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2.5 sm:py-1 rounded-md border border-slate-200 bg-white w-full sm:w-auto min-h-[44px] sm:min-h-0"
          >
            Borrar
          </button>
        </div>
      </div>
    )
  }
)

CertificateSignaturePad.displayName = 'CertificateSignaturePad'

export default CertificateSignaturePad
