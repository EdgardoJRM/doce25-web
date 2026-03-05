import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

// Blog posts data (en producción esto vendría de un CMS o DB)
const blogPosts: Record<string, {
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  category: string
  readTime: string
  author: string
}> = {
  'como-reducir-plastico-en-casa': {
    title: '10 Formas de Reducir el Plástico en Casa',
    excerpt: 'Pequeños cambios que hacen una gran diferencia. Aprende cómo reducir tu huella de plástico con estos consejos prácticos.',
    content: `
      <p>El plástico está en todas partes de nuestras vidas, pero reducir su uso es más fácil de lo que piensas. Aquí te compartimos 10 formas prácticas de reducir el plástico en tu hogar.</p>
      
      <h2>1. Usa bolsas reutilizables</h2>
      <p>Lleva siempre bolsas de tela cuando vayas de compras. Guarda algunas en tu carro, cartera o mochila para que nunca te falten.</p>
      
      <h2>2. Botella de agua reutilizable</h2>
      <p>Una botella de acero inoxidable o vidrio puede durar años y evitar cientos de botellas plásticas al año.</p>
      
      <h2>3. Evita los sorbetos plásticos</h2>
      <p>Di no a los sorbetos en restaurantes o usa alternativas de bambú, metal o papel.</p>
      
      <h2>4. Compra a granel</h2>
      <p>Muchas tiendas ofrecen productos a granel. Lleva tus propios envases y reduce el empaque innecesario.</p>
      
      <h2>5. Jabón y champú en barra</h2>
      <p>Los productos sólidos eliminan la necesidad de botellas plásticas y duran más que sus versiones líquidas.</p>
      
      <h2>6. Contenedores de vidrio</h2>
      <p>Reemplaza los tuppers plásticos por contenedores de vidrio. Son más duraderos y no liberan químicos.</p>
      
      <h2>7. Cepillo de dientes de bambú</h2>
      <p>Los cepillos de bambú son biodegradables y funcionan igual que los plásticos.</p>
      
      <h2>8. Compra productos con menos empaque</h2>
      <p>Elige productos con empaque mínimo o reciclable cuando sea posible.</p>
      
      <h2>9. Evita los productos de un solo uso</h2>
      <p>Cubiertos, platos y vasos desechables pueden reemplazarse fácilmente por opciones reutilizables.</p>
      
      <h2>10. Haz tu propia limpieza</h2>
      <p>Productos de limpieza caseros con vinagre y bicarbonato son efectivos y eliminan la necesidad de múltiples botellas plásticas.</p>
      
      <h2>El impacto de tus acciones</h2>
      <p>Si cada persona en Puerto Rico adoptara solo 3 de estos hábitos, podríamos reducir millones de libras de plástico al año. Cada pequeña acción cuenta.</p>
      
      <p><strong>¿Quieres hacer más?</strong> Únete a nuestras limpiezas de playa y ayuda a remover el plástico que ya llegó a nuestras costas.</p>
    `,
    image: '/hero/hero-1.jpg',
    date: '2026-02-20',
    category: 'Consejos',
    readTime: '5 min',
    author: 'Equipo Doce25',
  },
  'impacto-plastico-oceanos': {
    title: 'El Impacto del Plástico en Nuestros Océanos',
    excerpt: 'Cada año, 8 millones de toneladas de plástico terminan en el océano. Descubre cómo afecta a la vida marina y qué podemos hacer.',
    content: `
      <p>Los océanos cubren más del 70% de nuestro planeta y son hogar de millones de especies. Pero cada año, 8 millones de toneladas de plástico terminan en sus aguas, amenazando la vida marina y los ecosistemas costeros.</p>
      
      <h2>¿Cómo llega el plástico al océano?</h2>
      <p>El 80% del plástico marino proviene de fuentes terrestres: ríos, desagües, playas y vertederos mal manejados. El otro 20% proviene de actividades marítimas como la pesca y el transporte.</p>
      
      <h2>El impacto en la vida marina</h2>
      <p>Más de 700 especies marinas han sido afectadas por la contaminación plástica. Las tortugas confunden las bolsas con medusas, las aves marinas alimentan a sus crías con fragmentos plásticos, y los peces ingieren microplásticos que eventualmente llegan a nuestros platos.</p>
      
      <h2>Microplásticos: el enemigo invisible</h2>
      <p>Los microplásticos son fragmentos menores a 5mm que provienen de la degradación de plásticos más grandes o de productos como exfoliantes y ropa sintética. Se han encontrado en el agua potable, la sal de mesa, y hasta en la lluvia.</p>
      
      <h2>El problema en Puerto Rico</h2>
      <p>Como isla, Puerto Rico está especialmente vulnerable a la contaminación marina. Nuestras playas reciben basura tanto local como de corrientes oceánicas. En Doce25 hemos removido más de 53,000 libras de basura de nuestras costas.</p>
      
      <h2>¿Qué podemos hacer?</h2>
      <ul>
        <li>Reducir nuestro consumo de plásticos de un solo uso</li>
        <li>Participar en limpiezas de playa</li>
        <li>Apoyar legislación que limite el plástico</li>
        <li>Educar a otros sobre el problema</li>
        <li>Elegir productos con menos empaque</li>
      </ul>
      
      <p><strong>Únete al movimiento.</strong> Cada acción cuenta en la lucha por océanos más limpios.</p>
    `,
    image: '/hero/hero-2.jpg',
    date: '2026-02-15',
    category: 'Educación',
    readTime: '7 min',
    author: 'Equipo Doce25',
  },
}

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    return {
      title: 'Artículo no encontrado | Doce25',
    }
  }

  return {
    title: `${post.title} | Blog Doce25`,
    description: post.excerpt,
    keywords: [
      post.category.toLowerCase(),
      'doce25 blog',
      'conservación marina',
      'puerto rico',
      ...post.title.toLowerCase().split(' '),
    ],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://doce25.precotracks.org/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
    alternates: {
      canonical: `https://doce25.precotracks.org/blog/${slug}`,
    },
  }
}

function generateArticleJsonLd(post: typeof blogPosts[string], slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: `https://doce25.precotracks.org${post.image}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://doce25.precotracks.org',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Doce25',
      logo: {
        '@type': 'ImageObject',
        url: 'https://doce25.precotracks.org/doce25-logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://doce25.precotracks.org/blog/${slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    notFound()
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateArticleJsonLd(post, slug)),
        }}
      />

      <article className="min-h-screen bg-white">
        {/* Hero */}
        <header className="relative h-[50vh] min-h-[400px]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto max-w-3xl">
              <span className="inline-block bg-cyan-600 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-300 text-sm">
                <span>{post.author}</span>
                <span>•</span>
                <span>
                  {new Date(post.date).toLocaleDateString('es-PR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span>{post.readTime} lectura</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-cyan-600 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="mt-12 p-8 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl border border-cyan-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Quieres hacer la diferencia?
            </h3>
            <p className="text-gray-700 mb-6">
              Únete a nuestro próximo evento de limpieza de playa y ayuda a proteger las costas de Puerto Rico.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/eventos"
                className="inline-block bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition"
              >
                Ver Próximos Eventos
              </Link>
              <Link
                href="/donar"
                className="inline-block bg-white text-cyan-600 px-6 py-3 rounded-lg font-semibold border-2 border-cyan-600 hover:bg-cyan-50 transition"
              >
                Donar
              </Link>
            </div>
          </div>

          {/* Share */}
          <div className="mt-8 pt-8 border-t">
            <p className="text-gray-600 mb-4">Comparte este artículo:</p>
            <div className="flex gap-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=https://doce25.precotracks.org/blog/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                aria-label="Compartir en Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                </svg>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=https://doce25.precotracks.org/blog/${slug}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
                aria-label="Compartir en X"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(post.title + ' - https://doce25.precotracks.org/blog/' + slug)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                aria-label="Compartir en WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Back to blog */}
          <div className="mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al Blog
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}

