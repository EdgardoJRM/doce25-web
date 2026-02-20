'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

// Datos de pueblos impactados por Doce25
export interface TownData {
  name: string
  coordinates: [number, number] // [lat, lng]
  cleanups: number
  volunteers: number
  wasteColl: number // en libras
  date: string
  description?: string
  images?: string[]
}

// Datos iniciales de ejemplo - puedes agregar más pueblos según tu trabajo
const TOWNS_DATA: TownData[] = [
  {
    name: 'San Juan',
    coordinates: [18.4655, -66.1057],
    cleanups: 5,
    volunteers: 120,
    wasteColl: 2500,
    date: '2024-03-15',
    description: 'Limpieza de playas urbanas en El Escambrón y Condado',
  },
  {
    name: 'Carolina',
    coordinates: [18.3809, -65.9571],
    cleanups: 3,
    volunteers: 85,
    wasteColl: 1800,
    date: '2024-06-20',
    description: 'Limpieza costera en Isla Verde y Piñones',
  },
  {
    name: 'Luquillo',
    coordinates: [18.3725, -65.7169],
    cleanups: 2,
    volunteers: 60,
    wasteColl: 1200,
    date: '2024-08-10',
    description: 'Limpieza de Playa Luquillo y áreas costeras',
  },
  {
    name: 'Fajardo',
    coordinates: [18.3258, -65.6525],
    cleanups: 2,
    volunteers: 55,
    wasteColl: 950,
    date: '2024-09-05',
    description: 'Limpieza en Seven Seas y La Chiva',
  },
  {
    name: 'Rincón',
    coordinates: [18.3406, -67.2494],
    cleanups: 4,
    volunteers: 95,
    wasteColl: 1600,
    date: '2024-10-12',
    description: 'Limpieza de playas surferas y área del faro',
  },
  {
    name: 'Aguadilla',
    coordinates: [18.4272, -67.1541],
    cleanups: 3,
    volunteers: 70,
    wasteColl: 1300,
    date: '2024-11-08',
    description: 'Limpieza de Crash Boat y playas del noroeste',
  },
  {
    name: 'Isabela',
    coordinates: [18.5081, -67.0292],
    cleanups: 2,
    volunteers: 50,
    wasteColl: 800,
    date: '2025-01-15',
    description: 'Limpieza de Jobos Beach y costa norte',
  },
  {
    name: 'Cabo Rojo',
    coordinates: [18.0866, -67.1458],
    cleanups: 3,
    volunteers: 75,
    wasteColl: 1400,
    date: '2025-02-10',
    description: 'Limpieza de Playa Sucia y área del faro',
  },
]

// Importar el mapa de forma dinámica para evitar problemas de SSR
const MapComponent = dynamic(() => import('./MapComponentInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  ),
})

export default function InteractivePuertoRicoMap() {
  const [selectedTown, setSelectedTown] = useState<TownData | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    )
  }

  // Calcular totales
  const totalCleanups = TOWNS_DATA.reduce((sum, town) => sum + town.cleanups, 0)
  const totalVolunteers = TOWNS_DATA.reduce((sum, town) => sum + town.volunteers, 0)
  const totalWaste = TOWNS_DATA.reduce((sum, town) => sum + town.wasteColl, 0)

  return (
    <div className="space-y-8">
      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-3xl font-bold mb-2">{TOWNS_DATA.length}</div>
          <div className="text-cyan-100">Pueblos Impactados</div>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-3xl font-bold mb-2">{totalCleanups}</div>
          <div className="text-teal-100">Limpiezas Realizadas</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-3xl font-bold mb-2">{totalVolunteers}</div>
          <div className="text-blue-100">Voluntarios</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-3xl font-bold mb-2">{(totalWaste / 1000).toFixed(1)}k</div>
          <div className="text-green-100">Libras Recogidas</div>
        </div>
      </div>

      {/* Mapa Interactivo */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-cyan-500 to-teal-500">
          <h2 className="text-2xl font-bold text-white mb-2">
            🗺️ Mapa de Impacto en Puerto Rico
          </h2>
          <p className="text-cyan-50">
            Haz clic en los marcadores para ver detalles de cada pueblo
          </p>
        </div>

        <div className="relative h-[600px]">
          <MapComponent 
            townsData={TOWNS_DATA} 
            onTownSelect={setSelectedTown}
            selectedTown={selectedTown}
          />
        </div>
      </div>

      {/* Lista de Pueblos */}
      <div className="bg-white rounded-xl shadow-xl p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          📍 Pueblos Impactados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOWNS_DATA.map((town) => (
            <button
              key={town.name}
              onClick={() => setSelectedTown(town)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                selectedTown?.name === town.name
                  ? 'border-cyan-500 bg-cyan-50'
                  : 'border-gray-200 hover:border-cyan-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-gray-900">{town.name}</h4>
                <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                  {town.cleanups} {town.cleanups === 1 ? 'limpieza' : 'limpiezas'}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-2">👥</span>
                  {town.volunteers} voluntarios
                </div>
                <div className="flex items-center">
                  <span className="mr-2">♻️</span>
                  {town.wasteColl.toLocaleString()} lbs
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-2">📅</span>
                  {new Date(town.date).toLocaleDateString('es-PR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detalle del Pueblo Seleccionado */}
      {selectedTown && (
        <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl shadow-xl p-8 text-white">
          <button
            onClick={() => setSelectedTown(null)}
            className="float-right text-white hover:text-cyan-100 text-2xl"
          >
            ×
          </button>
          <h3 className="text-3xl font-bold mb-4">📍 {selectedTown.name}</h3>
          {selectedTown.description && (
            <p className="text-cyan-50 mb-6 text-lg">{selectedTown.description}</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{selectedTown.cleanups}</div>
              <div className="text-cyan-100 text-sm">Limpiezas</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{selectedTown.volunteers}</div>
              <div className="text-cyan-100 text-sm">Voluntarios</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{selectedTown.wasteColl}</div>
              <div className="text-cyan-100 text-sm">Libras</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-lg font-bold">
                {new Date(selectedTown.date).toLocaleDateString('es-PR', {
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
              <div className="text-cyan-100 text-sm">Última visita</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Exportar también los datos para uso externo si es necesario
export { TOWNS_DATA }

