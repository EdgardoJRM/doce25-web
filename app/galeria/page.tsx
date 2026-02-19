'use client'

import { useState } from 'react'

export default function GaleriaPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Fotos del club - usar imágenes en public/hero e public/images
  const photos = [
    '/hero/hero-1.jpg',
    '/hero/hero-2.jpg',
    '/hero/hero-3.jpg',
    '/hero/hero-4.jpg',
    '/hero/hero-5.jpg',
    '/images/doce25-hero-main.jpg',
    '/images/doce25-featured.jpg',
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
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
    </div>
  )
}




import { useState } from 'react'

export default function GaleriaPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Fotos del club - usar imágenes en public/hero e public/images
  const photos = [
    '/hero/hero-1.jpg',
    '/hero/hero-2.jpg',
    '/hero/hero-3.jpg',
    '/hero/hero-4.jpg',
    '/hero/hero-5.jpg',
    '/images/doce25-hero-main.jpg',
    '/images/doce25-featured.jpg',
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
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
    </div>
  )
}

