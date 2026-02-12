'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function GaleriaPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Fotos de la carpeta Fotos doce25/
  const photos = [
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.05 (1).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.05.jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.26.jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.35 (1).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.35.jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.36 (1).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.36 (2).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.36 (3).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.36.jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.37 (1).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.37.jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.42 (1).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.42 (2).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.42.jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.43 (1).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.43 (2).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.43.jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.44 (1).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.44 (2).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.44.jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.45 (1).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.45 (2).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.45.jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.46 (1).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.46 (2).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.46.jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.47 (1).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.47 (2).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.47.jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.48 (1).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.48 (2).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.48.jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.49 (1).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.49 (2).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.49.jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.50.jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.51 (1).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.51.jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.52 (1).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.52 (2).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.52 (3).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.52 (4).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.52 (5).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.52 (6).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.52 (7).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.52.jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.53 (1).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.53 (2).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.53 (3).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.53 (4).jpeg',
    '/Fotos doce25/WhatsApp Image 2025-09-14 at 19.41.53.jpeg',
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Galería de Momentos
            </h1>
            <p className="text-xl text-gray-600">
              Revive los momentos especiales que hemos compartido con las comunidades
            </p>
          </div>

          {/* Grid de Fotos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition duration-300"
                onClick={() => setSelectedImage(photo)}
              >
                <img
                  src={photo}
                  alt={`Galería Dosce25 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Modal para ver imagen ampliada */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-6xl max-h-full">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-10 right-0 text-white text-4xl hover:text-gray-300"
                >
                  ×
                </button>
                <img
                  src={selectedImage}
                  alt="Imagen ampliada"
                  className="max-w-full max-h-[90vh] object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

