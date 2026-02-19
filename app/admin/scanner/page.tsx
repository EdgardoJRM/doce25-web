'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Html5Qrcode } from 'html5-qrcode'

export default function ScannerPage() {
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState('')
  const [lastScan, setLastScan] = useState('')
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isRunningRef = useRef(false)

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner

    const startScanner = async () => {
      // Evitar iniciar si ya está corriendo
      if (isRunningRef.current) return
      
      try {
        setIsScanning(true)
        setError('')
        isRunningRef.current = true
        
        await scanner.start(
          { facingMode: 'environment' }, // Cámara trasera
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText) => {
            // Extraer el token del URL escaneado
            try {
              const url = new URL(decodedText)
              const pathParts = url.pathname.split('/')
              const token = pathParts[pathParts.length - 1]
              
              if (token && token !== lastScan && isRunningRef.current) {
                setLastScan(token)
                isRunningRef.current = false
                
                // Detener el escáner antes de navegar
                try {
                  await scanner.stop()
                } catch (stopErr: any) {
                  // Ignorar error si el scanner ya está detenido
                  if (!stopErr.message?.includes('not running')) {
                    console.error('Error stopping scanner:', stopErr)
                  }
                }
                
                router.push(`/checkin/${token}?from=scanner`)
              }
            } catch {
              // Si no es un URL válido, asumir que es el token directamente
              if (decodedText && decodedText !== lastScan && isRunningRef.current) {
                setLastScan(decodedText)
                isRunningRef.current = false
                
                try {
                  await scanner.stop()
                } catch (stopErr: any) {
                  // Ignorar error si el scanner ya está detenido
                  if (!stopErr.message?.includes('not running')) {
                    console.error('Error stopping scanner:', stopErr)
                  }
                }
                
                router.push(`/checkin/${decodedText}?from=scanner`)
              }
            }
          },
          (errorMessage) => {
            // Ignorar errores de escaneo (son normales cuando no hay QR visible)
          }
        )
      } catch (err: any) {
        console.error('Scanner error:', err)
        setError('Error al iniciar la cámara. Asegúrate de haber dado permisos.')
        setIsScanning(false)
        isRunningRef.current = false
      }
    }

    startScanner()

    return () => {
      if (scannerRef.current && isRunningRef.current) {
        isRunningRef.current = false
        scannerRef.current.stop().catch((err: any) => {
          // Ignorar error si el scanner ya está detenido
          if (!err.message?.includes('not running') && !err.message?.includes('not paused')) {
            console.error('Error stopping scanner on cleanup:', err)
          }
        })
      }
    }
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Escáner QR</h1>
          <p className="text-gray-600">
            Apunta la cámara al código QR del asistente para realizar el check-in
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div id="qr-reader" className="w-full"></div>
          
          <div className="p-6">
            <div className="flex items-center justify-center space-x-2">
              {isScanning ? (
                <>
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">Escaneando...</span>
                </>
              ) : (
                <>
                  <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-500">Cámara detenida</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Instrucciones:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Asegúrate de tener buena iluminación</li>
            <li>• Mantén el código QR dentro del recuadro</li>
            <li>• El check-in se procesará automáticamente al escanear</li>
            <li>• Si ya se hizo check-in, verás una notificación</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/admin/eventos')}
            className="text-blue-600 hover:underline"
          >
            ← Volver a Eventos
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Html5Qrcode } from 'html5-qrcode'

export default function ScannerPage() {
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState('')
  const [lastScan, setLastScan] = useState('')
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isRunningRef = useRef(false)

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner

    const startScanner = async () => {
      // Evitar iniciar si ya está corriendo
      if (isRunningRef.current) return
      
      try {
        setIsScanning(true)
        setError('')
        isRunningRef.current = true
        
        await scanner.start(
          { facingMode: 'environment' }, // Cámara trasera
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText) => {
            // Extraer el token del URL escaneado
            try {
              const url = new URL(decodedText)
              const pathParts = url.pathname.split('/')
              const token = pathParts[pathParts.length - 1]
              
              if (token && token !== lastScan && isRunningRef.current) {
                setLastScan(token)
                isRunningRef.current = false
                
                // Detener el escáner antes de navegar
                try {
                  await scanner.stop()
                } catch (stopErr: any) {
                  // Ignorar error si el scanner ya está detenido
                  if (!stopErr.message?.includes('not running')) {
                    console.error('Error stopping scanner:', stopErr)
                  }
                }
                
                router.push(`/checkin/${token}?from=scanner`)
              }
            } catch {
              // Si no es un URL válido, asumir que es el token directamente
              if (decodedText && decodedText !== lastScan && isRunningRef.current) {
                setLastScan(decodedText)
                isRunningRef.current = false
                
                try {
                  await scanner.stop()
                } catch (stopErr: any) {
                  // Ignorar error si el scanner ya está detenido
                  if (!stopErr.message?.includes('not running')) {
                    console.error('Error stopping scanner:', stopErr)
                  }
                }
                
                router.push(`/checkin/${decodedText}?from=scanner`)
              }
            }
          },
          (errorMessage) => {
            // Ignorar errores de escaneo (son normales cuando no hay QR visible)
          }
        )
      } catch (err: any) {
        console.error('Scanner error:', err)
        setError('Error al iniciar la cámara. Asegúrate de haber dado permisos.')
        setIsScanning(false)
        isRunningRef.current = false
      }
    }

    startScanner()

    return () => {
      if (scannerRef.current && isRunningRef.current) {
        isRunningRef.current = false
        scannerRef.current.stop().catch((err: any) => {
          // Ignorar error si el scanner ya está detenido
          if (!err.message?.includes('not running') && !err.message?.includes('not paused')) {
            console.error('Error stopping scanner on cleanup:', err)
          }
        })
      }
    }
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Escáner QR</h1>
          <p className="text-gray-600">
            Apunta la cámara al código QR del asistente para realizar el check-in
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div id="qr-reader" className="w-full"></div>
          
          <div className="p-6">
            <div className="flex items-center justify-center space-x-2">
              {isScanning ? (
                <>
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">Escaneando...</span>
                </>
              ) : (
                <>
                  <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-500">Cámara detenida</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Instrucciones:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Asegúrate de tener buena iluminación</li>
            <li>• Mantén el código QR dentro del recuadro</li>
            <li>• El check-in se procesará automáticamente al escanear</li>
            <li>• Si ya se hizo check-in, verás una notificación</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/admin/eventos')}
            className="text-blue-600 hover:underline"
          >
            ← Volver a Eventos
          </button>
        </div>
      </div>
    </div>
  )
}
