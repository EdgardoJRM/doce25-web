'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Icon, LatLngExpression } from 'leaflet'
import { useEffect } from 'react'
import { TownData } from './InteractivePuertoRicoMap'

// Fix para iconos de Leaflet en Next.js
if (typeof window !== 'undefined') {
  delete (Icon.Default.prototype as any)._getIconUrl
  Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

// Crear un ícono personalizado para los pueblos impactados
const createCustomIcon = (cleanups: number) => {
  const size = Math.min(40 + cleanups * 3, 60)
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
        <circle cx="12" cy="12" r="10" fill="#06b6d4" opacity="0.8"/>
        <circle cx="12" cy="12" r="7" fill="#0891b2"/>
        <text x="12" y="16" text-anchor="middle" font-size="10" fill="white" font-weight="bold">${cleanups}</text>
      </svg>
    `)}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  })
}

interface MapComponentInnerProps {
  townsData: TownData[]
  onTownSelect: (town: TownData | null) => void
  selectedTown: TownData | null
}

// Componente para manejar el zoom cuando se selecciona un pueblo
function MapController({ selectedTown }: { selectedTown: TownData | null }) {
  const map = useMap()

  useEffect(() => {
    if (selectedTown) {
      map.flyTo(selectedTown.coordinates, 11, {
        duration: 1.5,
      })
    } else {
      // Volver a la vista general de Puerto Rico
      map.flyTo([18.2208, -66.5901], 9, {
        duration: 1.5,
      })
    }
  }, [selectedTown, map])

  return null
}

export default function MapComponentInner({
  townsData,
  onTownSelect,
  selectedTown,
}: MapComponentInnerProps) {
  // Centro de Puerto Rico
  const center: LatLngExpression = [18.2208, -66.5901]

  return (
    <MapContainer
      center={center}
      zoom={9}
      scrollWheelZoom={true}
      className="h-full w-full"
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController selectedTown={selectedTown} />

      {townsData.map((town) => (
        <Marker
          key={town.name}
          position={town.coordinates}
          icon={createCustomIcon(town.cleanups)}
          eventHandlers={{
            click: () => {
              onTownSelect(town)
            },
          }}
        >
          <Popup>
            <div className="p-2 min-w-[250px]">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                📍 {town.name}
              </h3>
              {town.description && (
                <p className="text-sm text-gray-600 mb-3">{town.description}</p>
              )}
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="font-semibold mr-2">🧹 Limpiezas:</span>
                  <span className="text-cyan-600 font-bold">{town.cleanups}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-semibold mr-2">👥 Voluntarios:</span>
                  <span className="text-teal-600 font-bold">{town.volunteers}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-semibold mr-2">♻️ Residuos:</span>
                  <span className="text-green-600 font-bold">
                    {town.wasteColl.toLocaleString()} lbs
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 pt-2 border-t">
                  <span className="mr-2">📅</span>
                  {new Date(town.date).toLocaleDateString('es-PR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
              <button
                onClick={() => onTownSelect(town)}
                className="mt-3 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Ver más detalles →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

