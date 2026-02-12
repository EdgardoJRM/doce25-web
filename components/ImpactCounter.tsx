'use client'

import { useEffect, useState } from 'react'

interface ImpactCounterProps {
  target: number
  label: string
  unit?: string
  duration?: number
}

function AnimatedCounter({ target, label, unit = '', duration = 2000 }: ImpactCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    const element = document.getElementById('impact-counter')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const startValue = 0

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.floor(startValue + (target - startValue) * easeOut)

      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, target, duration])

  return (
    <div id="impact-counter" className="text-center">
      <div className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gradient mb-3">
        {count.toLocaleString()}{unit}
      </div>
      <div className="text-gray-600 font-medium text-lg">{label}</div>
    </div>
  )
}

export function ImpactCounter() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    const element = document.getElementById('impact-bar')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    // Animate progress bar
    const targetProgress = 100 // 100% of our goal
    const duration = 2500
    const startTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progressValue = Math.min((elapsed / duration) * targetProgress, targetProgress)

      setProgress(progressValue)

      if (progressValue < targetProgress) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible])

  const totalLbs = 69554
  const goalLbs = 100000 // Meta de 100,000 libras

  return (
    <section className="section-padding bg-gradient-to-br from-blue-50 via-white to-ocean-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-ocean-200/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              Nuestro Impacto
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
              Basura removida de<br />
              <span className="text-gradient">nuestras playas</span>
            </h2>
          </div>

          {/* Animated Counter */}
          <div className="mb-16">
            <AnimatedCounter
              target={totalLbs}
              label="Libras de basura removida"
              unit=" lbs"
            />
          </div>

          {/* Progress Bar */}
          <div id="impact-bar" className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 font-semibold">Progreso hacia nuestra meta</span>
              <span className="text-gray-600 font-bold">
                {Math.round((totalLbs / goalLbs) * 100)}%
              </span>
            </div>
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 via-blue-500 to-ocean-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{
                  width: `${isVisible ? (totalLbs / goalLbs) * 100 : 0}%`,
                  transition: 'width 2.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700 z-10">
                  {totalLbs.toLocaleString()} / {goalLbs.toLocaleString()} lbs
                </span>
              </div>
            </div>
            <p className="text-center text-gray-600 mt-4 font-medium">
              Meta: 100,000 libras removidas
            </p>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
              <div className="text-4xl mb-3">🏖️</div>
              <div className="text-3xl font-display font-bold text-blue-600 mb-2">20</div>
              <div className="text-gray-600 font-medium">Limpiezas realizadas</div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
              <div className="text-4xl mb-3">👥</div>
              <div className="text-3xl font-display font-bold text-ocean-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Voluntarios movilizados</div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
              <div className="text-4xl mb-3">🌊</div>
              <div className="text-3xl font-display font-bold text-blue-600 mb-2">1225</div>
              <div className="text-gray-600 font-medium">Playas en Puerto Rico</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

