'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const eventName = searchParams.get('event') || 'el evento'
  const email = searchParams.get('email') || 'tu correo electrónico'

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¡Registro Exitoso!
          </h1>

          {/* Message */}
          <p className="text-lg text-gray-700 mb-6">
            Te has registrado exitosamente para <span className="font-semibold text-cyan-600">{eventName}</span>
          </p>

          {/* Email Info */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <svg 
                className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Revisa tu correo electrónico
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Hemos enviado tu entrada digital con código QR a:
                </p>
                <p className="text-sm font-mono bg-white px-3 py-2 rounded border border-cyan-300 text-cyan-700">
                  {email}
                </p>
              </div>
            </div>
          </div>

          {/* What's next */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg 
                className="w-5 h-5 text-cyan-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              ¿Qué sigue?
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-cyan-600 font-bold">1.</span>
                <span>Revisa tu bandeja de entrada (y la carpeta de spam si no lo ves)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-600 font-bold">2.</span>
                <span>Descarga o guarda el PDF adjunto con tu entrada digital</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-600 font-bold">3.</span>
                <span>Presenta tu código QR (digital o impreso) el día del evento</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-600 font-bold">4.</span>
                <span>Si no recibes el correo en 5 minutos, contáctanos</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/eventos"
              className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-colors"
            >
              Ver Más Eventos
            </Link>
            <Link
              href="/perfil"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Ir a Mi Perfil
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              ¿Problemas con tu registro?{' '}
              <Link href="/contacto" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                Contáctanos
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-2"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function RegistroExitosoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}

