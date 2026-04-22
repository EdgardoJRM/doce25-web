'use client'

export function CopyShareLink({ url }: { url: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(url).catch(() => {})
      }}
      className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-500/40 sm:w-auto"
    >
      Copiar enlace
    </button>
  )
}
