'use client'

import { useEffect, useState, useRef } from 'react'

interface CounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
}

function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '', decimals = 0 }: CounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          
          const startTime = Date.now()
          const startCount = 0

          const animate = () => {
            const now = Date.now()
            const progress = Math.min((now - startTime) / duration, 1)
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const currentCount = startCount + (end - startCount) * easeOutQuart

            setCount(currentCount)

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setCount(end)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current)
      }
    }
  }, [end, duration, hasAnimated])

  return (
    <div ref={counterRef} className="tabular-nums">
      {prefix}
      {count.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </div>
  )
}

export function ImpactCounter() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const stats = [
    {
      id: 1,
      value: 69000,
      suffix: '+',
      label: 'Libras de Basura',
      sublabel: 'Removidas de nuestras costas',
      icon: '♻️',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      ring: 'ring-emerald-500/20',
    },
    {
      id: 2,
      value: 1250,
      suffix: '+',
      label: 'Voluntarios',
      sublabel: 'Comprometidos con el cambio',
      icon: '👥',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      ring: 'ring-blue-500/20',
    },
    {
      id: 3,
      value: 5,
      suffix: '+',
      label: 'Años de Impacto',
      sublabel: 'Transformando Puerto Rico',
      icon: '🌊',
      gradient: 'from-cyan-500 to-teal-500',
      bgGradient: 'from-cyan-50 to-teal-50',
      ring: 'ring-cyan-500/20',
    },
    {
      id: 4,
      value: 50,
      suffix: '+',
      label: 'Eventos Realizados',
      sublabel: 'En playas de toda la isla',
      icon: '🏖️',
      gradient: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-50 to-amber-50',
      ring: 'ring-orange-500/20',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nuestro Impacto en Números
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Cada acción cuenta. Juntos estamos haciendo la diferencia en nuestras playas.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              onMouseEnter={() => setHoveredCard(stat.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 -z-10`}></div>
              
              {/* Card */}
              <div className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 ${
                hoveredCard === stat.id ? `border-transparent ring-4 ${stat.ring}` : 'border-gray-100'
              } ${hoveredCard === stat.id ? 'scale-105 -translate-y-2' : ''}`}>
                
                {/* Background Pattern */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`text-5xl mb-4 transform transition-all duration-500 ${
                    hoveredCard === stat.id ? 'scale-125 rotate-12' : ''
                  }`}>
                    {stat.icon}
                  </div>

                  {/* Counter */}
                  <div className={`text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent transition-all duration-500`}>
                    <AnimatedCounter 
                      end={stat.value} 
                      suffix={stat.suffix}
                      duration={2500}
                    />
                  </div>

                  {/* Label */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {stat.label}
                  </h3>

                  {/* Sublabel */}
                  <p className="text-sm text-gray-600">
                    {stat.sublabel}
                  </p>

                  {/* Progress Bar Animation */}
                  <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 ease-out ${
                        hoveredCard === stat.id ? 'w-full' : 'w-0'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Sparkle Effect */}
                {hoveredCard === stat.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-lg text-gray-700 mb-6 font-medium">
            ¿Quieres ser parte de estos números?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/eventos"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-600 to-teal-600 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Únete a un Evento
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            </a>
            
            <a
              href="/donar"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-cyan-600 bg-white border-2 border-cyan-600 rounded-full hover:bg-cyan-50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
            >
              Hacer una Donación
            </a>
          </div>
        </div>

        {/* Live Counter Indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg border border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              Impacto en tiempo real
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
