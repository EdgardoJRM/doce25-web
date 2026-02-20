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
  beaches: string[]
  region: 'Norte' | 'Este' | 'Sur'
  description?: string
  images?: string[]
}

// Datos REALES de impacto de Doce25
// Total: 53,130 libras | 16 limpiezas | 10 municipios
const TOWNS_DATA: TownData[] = [
  // REGIÓN NORTE
  {
    name: 'Manatí',
    coordinates: [18.4294, -66.4806],
    cleanups: 2,
    volunteers: 110,
    wasteColl: 8500,
    beaches: ['Mar Chiquita', 'Los Tubos'],
    region: 'Norte',
    description: 'Mayor impacto en el norte - Mar Chiquita (2 limpiezas) y Los Tubos (3 limpiezas)',
  },
  {
    name: 'Toa Baja',
    coordinates: [18.4447, -66.2540],
    cleanups: 1,
    volunteers: 45,
    wasteColl: 2800,
    beaches: ['Punta Salinas'],
    region: 'Norte',
    description: 'Limpieza en Punta Salinas, protegiendo el ecosistema costero del norte',
  },
  
  // REGIÓN ESTE
  {
    name: 'Loíza',
    coordinates: [18.4308, -65.8803],
    cleanups: 3,
    volunteers: 140,
    wasteColl: 12500,
    beaches: ['Vacía Talega', 'Aviones'],
    region: 'Este',
    description: 'Alta actividad en el este - Vacía Talega (1) y Aviones (3 limpiezas)',
  },
  {
    name: 'Luquillo',
    coordinates: [18.3725, -65.7169],
    cleanups: 1,
    volunteers: 55,
    wasteColl: 4200,
    beaches: ['Balneario de Luquillo'],
    region: 'Este',
    description: 'Limpieza en el icónico Balneario de Luquillo',
  },
  {
    name: 'Humacao',
    coordinates: [18.1497, -65.8272],
    cleanups: 1,
    volunteers: 50,
    wasteColl: 3800,
    beaches: ['Punta Santiago'],
    region: 'Este',
    description: 'Protección costera en Punta Santiago',
  },
  {
    name: 'Yabucoa',
    coordinates: [18.0503, -65.8792],
    cleanups: 1,
    volunteers: 48,
    wasteColl: 3600,
    beaches: ['Playa Lucía'],
    region: 'Este',
    description: 'Limpieza en Playa Lucía, costa sureste',
  },
  
  // REGIÓN SUR
  {
    name: 'Maunabo',
    coordinates: [18.0072, -65.8992],
    cleanups: 1,
    volunteers: 42,
    wasteColl: 3200,
    beaches: ['Playa Los Bohíos'],
    region: 'Sur',
    description: 'Conservación en Playa Los Bohíos, costa sur',
  },
  {
    name: 'Arroyo',
    coordinates: [17.9658, -66.0614],
    cleanups: 2,
    volunteers: 85,
    wasteColl: 6500,
    beaches: ['Playa El Faro', 'Punta Guilarte'],
    region: 'Sur',
    description: 'Limpiezas en El Faro y Punta Guilarte, protegiendo el sur',
  },
  {
    name: 'Guayama',
    coordinates: [17.9844, -66.1139],
    cleanups: 1,
    volunteers: 40,
    wasteColl: 3030,
    beaches: ['Playa Las Mareas'],
    region: 'Sur',
    description: 'Limpieza en Playa Las Mareas',
  },
  {
    name: 'Salinas',
    coordinates: [17.9792, -66.2980],
    cleanups: 3,
    volunteers: 125,
    wasteColl: 5000,
    beaches: ['Playa de Salinas'],
    region: 'Sur',
    description: 'Múltiples limpiezas en la costa sur',
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
  
  // Calcular por región
  const regionStats = {
    Norte: TOWNS_DATA.filter(t => t.region === 'Norte').length,
    Este: TOWNS_DATA.filter(t => t.region === 'Este').length,
    Sur: TOWNS_DATA.filter(t => t.region === 'Sur').length,
  }

  return (
    <div className="space-y-8">
      {/* Banner de Impacto Real */}
      <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            🌊 Impacto Real de Doce25
          </h2>
          <p className="text-xl text-cyan-50 mb-6">
            Datos verificados de nuestras limpiezas en Puerto Rico
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Actualizado Febrero 2026</span>
          </div>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-4xl font-bold mb-2">{TOWNS_DATA.length}</div>
          <div className="text-cyan-100 text-sm">Municipios Impactados</div>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-4xl font-bold mb-2">{totalCleanups}</div>
          <div className="text-teal-100 text-sm">Limpiezas Realizadas</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-4xl font-bold mb-2">{totalVolunteers.toLocaleString()}</div>
          <div className="text-blue-100 text-sm">Voluntarios (Estimado)</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-4xl font-bold mb-2">{(totalWaste / 1000).toFixed(1)}k</div>
          <div className="text-green-100 text-sm">Libras Recogidas</div>
        </div>
      </div>

      {/* Estadísticas por Región */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-cyan-500">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-lg">🏖️ Región Norte</h3>
            <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-semibold">
              {regionStats.Norte} pueblos
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            Manatí (mayor impacto), Toa Baja
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-teal-500">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-lg">🌅 Región Este</h3>
            <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">
              {regionStats.Este} pueblos
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            Loíza, Luquillo, Humacao, Yabucoa
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-lg">🌴 Región Sur</h3>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              {regionStats.Sur} pueblos
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            Maunabo, Arroyo, Guayama, Salinas
          </p>
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
          📍 Municipios y Playas Impactadas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOWNS_DATA.map((town) => (
            <button
              key={town.name}
              onClick={() => setSelectedTown(town)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                selectedTown?.name === town.name
                  ? 'border-cyan-500 bg-cyan-50 shadow-lg'
                  : 'border-gray-200 hover:border-cyan-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-gray-900">{town.name}</h4>
                  <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                    town.region === 'Norte' ? 'bg-cyan-100 text-cyan-700' :
                    town.region === 'Este' ? 'bg-teal-100 text-teal-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {town.region}
                  </span>
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full whitespace-nowrap">
                  {town.cleanups} {town.cleanups === 1 ? 'limpieza' : 'limpiezas'}
                </span>
              </div>
              
              {/* Playas */}
              <div className="mb-2 text-xs text-gray-600">
                <span className="font-semibold">🏖️ Playas:</span>
                <div className="mt-1 space-y-1">
                  {town.beaches.map((beach, idx) => (
                    <div key={idx} className="text-gray-700">• {beach}</div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600 border-t pt-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="mr-1">👥</span>
                    {town.volunteers} vol.
                  </span>
                  <span className="flex items-center">
                    <span className="mr-1">♻️</span>
                    {town.wasteColl.toLocaleString()} lbs
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detalle del Pueblo Seleccionado */}
      {selectedTown && (
        <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl shadow-xl p-8 text-white animate-fade-in">
          <button
            onClick={() => setSelectedTown(null)}
            className="float-right text-white hover:text-cyan-100 text-3xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
              selectedTown.region === 'Norte' ? 'bg-cyan-200 text-cyan-800' :
              selectedTown.region === 'Este' ? 'bg-teal-200 text-teal-800' :
              'bg-blue-200 text-blue-800'
            }`}>
              Región {selectedTown.region}
            </span>
          </div>
          <h3 className="text-3xl font-bold mb-4">📍 {selectedTown.name}</h3>
          {selectedTown.description && (
            <p className="text-cyan-50 mb-4 text-lg">{selectedTown.description}</p>
          )}
          
          {/* Playas */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-2 flex items-center">
              <span className="mr-2">🏖️</span>
              Playas Limpiadas:
            </h4>
            <ul className="space-y-1">
              {selectedTown.beaches.map((beach, idx) => (
                <li key={idx} className="text-cyan-50">• {beach}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{selectedTown.cleanups}</div>
              <div className="text-cyan-100 text-sm">Limpiezas</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{selectedTown.volunteers}</div>
              <div className="text-cyan-100 text-sm">Voluntarios (est.)</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{selectedTown.wasteColl.toLocaleString()}</div>
              <div className="text-cyan-100 text-sm">Libras removidas</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Exportar también los datos para uso externo si es necesario
export { TOWNS_DATA }

