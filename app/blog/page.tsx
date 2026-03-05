import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Blog | Noticias y Consejos de Conservación - Doce25',
  description: 'Lee nuestros artículos sobre conservación marina, consejos para reducir plásticos, historias de nuestras limpiezas de playa, y noticias ambientales de Puerto Rico.',
  keywords: [
    'blog conservación marina',
    'noticias ambientales puerto rico',
    'consejos reducir plástico',
    'historias voluntariado',
    'educación ambiental',
    'doce25 noticias',
    'playas puerto rico blog',
  ],
  openGraph: {
    title: 'Blog de Doce25 - Conservación Marina en Puerto Rico',
    description: 'Artículos, consejos y noticias sobre conservación de playas y océanos.',
    url: 'https://doce25.precotracks.org/blog',
    type: 'website',
  },
  alternates: {
    canonical: 'https://doce25.precotracks.org/blog',
  },
}

// Artículos de blog (por ahora estáticos, luego se pueden mover a CMS o DB)
const blogPosts = [
  {
    slug: 'como-reducir-plastico-en-casa',
    title: '10 Formas de Reducir el Plástico en Casa',
    excerpt: 'Pequeños cambios que hacen una gran diferencia. Aprende cómo reducir tu huella de plástico con estos consejos prácticos.',
    image: '/hero/hero-1.jpg',
    date: '2026-02-20',
    category: 'Consejos',
    readTime: '5 min',
  },
  {
    slug: 'impacto-plastico-oceanos',
    title: 'El Impacto del Plástico en Nuestros Océanos',
    excerpt: 'Cada año, 8 millones de toneladas de plástico terminan en el océano. Descubre cómo afecta a la vida marina y qué podemos hacer.',
    image: '/hero/hero-2.jpg',
    date: '2026-02-15',
    category: 'Educación',
    readTime: '7 min',
  },
  {
    slug: 'limpieza-mar-chiquita-febrero-2026',
    title: 'Limpieza en Mar Chiquita: 2,500 lbs Removidas',
    excerpt: 'Nuestro evento más reciente reunió a 85 voluntarios que removieron 2,500 libras de basura de esta icónica playa.',
    image: '/hero/hero-3.jpg',
    date: '2026-02-10',
    category: 'Eventos',
    readTime: '4 min',
  },
  {
    slug: 'tortugas-marinas-puerto-rico',
    title: 'Las Tortugas Marinas de Puerto Rico: Guía Completa',
    excerpt: 'Conoce las especies de tortugas marinas que anidan en nuestras playas y cómo protegerlas.',
    image: '/hero/hero-4.jpg',
    date: '2026-02-05',
    category: 'Educación',
    readTime: '8 min',
  },
  {
    slug: 'voluntariado-beneficios-salud-mental',
    title: 'Voluntariado y Salud Mental: Los Beneficios de Ayudar',
    excerpt: 'Estudios demuestran que el voluntariado mejora la salud mental. Descubre cómo limpiar playas puede mejorar tu bienestar.',
    image: '/hero/hero-5.jpg',
    date: '2026-01-28',
    category: 'Bienestar',
    readTime: '6 min',
  },
  {
    slug: 'microplasticos-que-son',
    title: '¿Qué Son los Microplásticos y Por Qué Importan?',
    excerpt: 'Los microplásticos están en todas partes, incluso en nuestra comida. Aprende qué son y cómo reducir tu exposición.',
    image: '/images/doce25-featured.jpg',
    date: '2026-01-20',
    category: 'Educación',
    readTime: '6 min',
  },
]

const categories = ['Todos', 'Consejos', 'Educación', 'Eventos', 'Bienestar']

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-600 via-teal-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Blog de Doce25
          </h1>
          <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
            Artículos, consejos y noticias sobre conservación marina y ambiental
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 py-4 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  category === 'Todos'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-cyan-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>
                        {new Date(post.date).toLocaleDateString('es-PR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span>{post.readTime} lectura</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-cyan-600 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Suscríbete a Nuestro Newsletter
          </h2>
          <p className="text-cyan-100 mb-8 max-w-xl mx-auto">
            Recibe consejos de conservación, noticias de eventos y actualizaciones directamente en tu correo.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
            <button
              type="submit"
              className="bg-white text-cyan-600 font-semibold px-6 py-3 rounded-lg hover:bg-cyan-50 transition"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sobre Nuestro Blog de Conservación
            </h2>
            <p className="text-gray-700">
              En el blog de Doce25 compartimos conocimientos sobre conservación marina, 
              consejos prácticos para reducir tu impacto ambiental, historias de nuestras 
              limpiezas de playa en Puerto Rico, y noticias relevantes sobre el medio ambiente.
            </p>
            <p className="text-gray-700">
              Nuestro objetivo es educar e inspirar a más personas a tomar acción por 
              nuestros océanos y playas. Ya sea que busques consejos para reducir el 
              plástico en tu hogar, información sobre las tortugas marinas de Puerto Rico, 
              o simplemente quieras leer sobre nuestros eventos, aquí encontrarás contenido 
              valioso y actualizado.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

