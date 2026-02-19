import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre Nosotros | Nuestra Misión y Visión',
  description: 'Conoce a Doce25, Fundación Tortuga Club PR. Organización 501(c)(3) sin fines de lucro dedicada a la limpieza de playas y conservación marina en Puerto Rico desde 2020. Más de 69,000 libras de basura removidas.',
  openGraph: {
    title: 'Sobre Doce25 - Fundación Tortuga Club PR',
    description: 'Transformando vidas a través del servicio y la solidaridad. Conoce nuestra misión de limpieza y conservación de playas en Puerto Rico.',
    type: 'website',
  },
}

export default function NosotrosPage() {
  return (
    <div className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/hero/hero-1.jpg"
          alt="Doce25 en acción"
          fill
          className="object-cover scale-105"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-cyan-900/50 to-black/70" />

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold px-5 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            Organización 501(c)(3) · Puerto Rico
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight drop-shadow-2xl">
            Somos <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">Doce25</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Transformando vidas a través del servicio,<br className="hidden md:block" /> la solidaridad y la conservación marina.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/eventos"
              className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-0.5"
            >
              Únete a un Evento
            </Link>
            <a
              href="#historia"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
            >
              Conoce más ↓
            </a>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/60">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-cyan-600 to-teal-600 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            {[
              { num: '69K+', label: 'Libras de basura removidas', icon: '🗑️' },
              { num: '5+',   label: 'Años de impacto', icon: '📅' },
              { num: '100+', label: 'Voluntarios activos', icon: '🙌' },
              { num: '501c3', label: 'Organización sin fines de lucro', icon: '🏛️' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-3xl">{stat.icon}</span>
                <span className="text-4xl md:text-5xl font-black">{stat.num}</span>
                <span className="text-white/80 text-sm max-w-[120px]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NUESTRA HISTORIA ─────────────────────────────────── */}
      <section id="historia" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            {/* Imagen */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
                <Image
                  src="/hero/hero-2.jpg"
                  alt="Nuestra historia"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent" />
              </div>
              {/* Badge flotante */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-2xl p-5 border border-gray-100">
                <p className="text-4xl font-black text-cyan-600">2020</p>
                <p className="text-gray-500 text-sm font-medium">Fundación</p>
              </div>
            </div>

            {/* Texto */}
            <div>
              <span className="text-cyan-500 font-semibold uppercase tracking-widest text-sm">Nuestra Historia</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 mb-6 leading-tight">
                De un sueño a miles de vidas impactadas
              </h2>
              <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
                <p>
                  La Fundación Doce25 nació del sueño de un grupo de jóvenes comprometidos con hacer
                  una diferencia en su comunidad. Inspirados por el mensaje de servicio y solidaridad,
                  decidieron unir fuerzas para crear un impacto positivo en Puerto Rico.
                </p>
                <p>
                  Lo que comenzó como pequeñas acciones comunitarias creció hasta convertirse en una
                  organización que toca miles de vidas cada año. Nuestro nombre <strong className="text-gray-900">&quot;Doce25&quot;</strong> representa
                  el compromiso de dar el 12.5% — o más — de nuestro tiempo, talento y recursos para
                  servir a los demás.
                </p>
                <p>
                  Hoy somos más que una fundación: somos una familia unida por el propósito común de
                  construir un Puerto Rico más limpio, más justo y lleno de esperanza.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISIÓN Y VISIÓN ──────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-cyan-500 font-semibold uppercase tracking-widest text-sm">Lo que nos mueve</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3">Misión & Visión</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Misión */}
              <div className="relative bg-gradient-to-br from-cyan-600 to-cyan-500 text-white p-10 rounded-3xl shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6">🎯</div>
                  <h3 className="text-2xl font-black mb-4">Nuestra Misión</h3>
                  <p className="text-white/90 text-lg leading-relaxed">
                    Servir a las comunidades de Puerto Rico a través de limpiezas de playas, educación
                    ambiental y desarrollo social — promoviendo el bienestar integral y generando
                    oportunidades de crecimiento para todos.
                  </p>
                </div>
              </div>

              {/* Visión */}
              <div className="relative bg-gradient-to-br from-teal-600 to-teal-500 text-white p-10 rounded-3xl shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6">🌊</div>
                  <h3 className="text-2xl font-black mb-4">Nuestra Visión</h3>
                  <p className="text-white/90 text-lg leading-relaxed">
                    Ser la organización referente de conservación marina y transformación social en
                    Puerto Rico — inspirando a cada generación a asumir su responsabilidad con el
                    planeta y la comunidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALORES ──────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-cyan-500 font-semibold uppercase tracking-widest text-sm">Lo que nos define</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3">Nuestros Valores</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { icon: '❤️', title: 'Amor',        desc: 'Servimos con amor genuino, poniendo el corazón en cada acción.',         color: 'from-rose-50 to-pink-50',    border: 'border-rose-200',   text: 'text-rose-600' },
                { icon: '🤝', title: 'Solidaridad', desc: 'Caminamos junto a quienes necesitan apoyo, siendo sus aliados.',           color: 'from-orange-50 to-amber-50', border: 'border-orange-200', text: 'text-orange-600' },
                { icon: '✨', title: 'Excelencia',  desc: 'Buscamos la excelencia en todo lo que hacemos, sin excusas.',              color: 'from-yellow-50 to-lime-50',  border: 'border-yellow-300', text: 'text-yellow-600' },
                { icon: '🙏', title: 'Humildad',    desc: 'Servimos con humildad, reconociendo que todos tenemos algo que aprender.', color: 'from-cyan-50 to-sky-50',     border: 'border-cyan-200',   text: 'text-cyan-600' },
                { icon: '💡', title: 'Creatividad', desc: 'Innovamos constantemente para multiplicar nuestro impacto.',               color: 'from-violet-50 to-purple-50',border: 'border-violet-200', text: 'text-violet-600' },
                { icon: '🌱', title: 'Integridad',  desc: 'Actuamos con honestidad y transparencia en todo momento.',                 color: 'from-emerald-50 to-teal-50', border: 'border-emerald-200',text: 'text-emerald-600' },
              ].map((v) => (
                <div
                  key={v.title}
                  className={`bg-gradient-to-br ${v.color} border ${v.border} rounded-2xl p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
                >
                  <div className="text-5xl mb-4">{v.icon}</div>
                  <h3 className={`text-xl font-black ${v.text} mb-2`}>{v.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOTO BANNER ──────────────────────────────────────── */}
      <section className="relative h-80 md:h-[500px] overflow-hidden">
        <Image
          src="/hero/hero-3.jpg"
          alt="Doce25 en la playa"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/80 to-teal-900/60 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <p className="text-2xl md:text-4xl font-black leading-snug">
                "Cada libra de basura que sacamos del océano<br className="hidden md:block" />
                es una promesa cumplida con las generaciones futuras."
              </p>
              <p className="mt-4 text-white/70 text-lg">— Equipo Doce25</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────── */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl mx-auto">
          <span className="text-cyan-400 font-semibold uppercase tracking-widest text-sm">Sé parte del cambio</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-6">
            ¿Listo para unirte<br className="hidden md:block" /> a la misión?
          </h2>
          <p className="text-gray-400 text-xl mb-10 leading-relaxed">
            Hay muchas formas de colaborar. Participa en un evento, dona o contáctanos
            — cualquier acción suma.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/eventos"
              className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5"
            >
              🏖️ Ver Eventos
            </Link>
            <a
              href="https://www.paypal.com/donate/?hosted_button_id=A8X4ZTZDF8F5N"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-0.5"
            >
              💚 Donar
            </a>
            <Link
              href="/contacto"
              className="border-2 border-white/20 hover:border-white/50 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-0.5"
            >
              ✉️ Contacto
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
