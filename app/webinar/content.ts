/**
 * Fuente única de verdad para copy y datos del webinar.
 * Para otro evento: duplica la carpeta app/webinar, renombra la ruta y edita este archivo + WEBINAR_SLUG en actions.ts.
 */
export const WEBINAR_SLUG = 'experiencia-ambiental-corporativa-2026' as const

export const webinarContent = {
  meta: {
    title:
      'Cómo estructurar una experiencia ambiental corporativa que sí deje huella | Webinar Doce25',
    description:
      'Qué hace que una iniciativa con propósito genere participación real, fortalezca cultura y produzca impacto medible, sin convertirse en una actividad vacía o difícil de ejecutar. Webinar online para equipos en Puerto Rico.',
    /** OG: usa logo hasta tener arte 1200×630 dedicado */
    ogImage: '/doce25-logo.png',
    canonicalPath: '/webinar',
  },
  event: {
    /** ISO 8601 con zona (America/Puerto_Rico ≈ -04:00). Placeholder para deploy — sustituye por fecha real. */
    startIso: '2026-10-14T18:30:00-04:00',
    endIso: '2026-10-14T19:30:00-04:00',
    dateDisplay: 'Miércoles 14 de octubre de 2026 · 6:30 PM AST',
    duration: '60 minutos',
    modality: 'Online · En vivo',
    price: 'Registro gratuito',
    capacity: 'Cupos limitados',
    /** Texto para emails y calendario */
    locationLabel: 'Enlace enviado por correo antes del evento',
  },
  hero: {
    eyebrow: 'Webinar para equipos corporativos en Puerto Rico',
    headline: 'Cómo estructurar una experiencia ambiental corporativa que sí deje huella',
    subheadline:
      'Qué hace que una iniciativa con propósito genere participación real, fortalezca cultura y produzca impacto medible, sin convertirse en una actividad vacía o difícil de ejecutar.',
    ctaLabel: 'Reservar mi cupo',
    microcopy:
      'Online · Registro gratuito · Cupos limitados · Sin costo ni compromiso',
  },
  paraQuienEs: {
    headline: 'Para quién es',
    intro:
      'Si tu rol implica movilizar personas, alinear cultura o representar a la empresa con propósito, esta sesión está pensada para ti.',
    cards: [
      {
        title: 'HR y People Ops',
        description:
          'Diseñas experiencias que la gente sí quiera vivir: onboarding, cultura, engagement. Aquí verás cómo traducir eso a una activación ambiental con estándar operativo.',
      },
      {
        title: 'CSR y sostenibilidad',
        description:
          'Necesitas narrativa creíble y resultados que se puedan explicar internamente y con stakeholders, sin depender solo de “la foto del día”.',
      },
      {
        title: 'Líderes de equipo',
        description:
          'Buscas algo que una al grupo sin sentir forzado: claridad de roles, logística sencilla y un cierre que se sienta logro, no caos.',
      },
      {
        title: 'Community relations',
        description:
          'Conectas marca y comunidad. Te interesa cómo estructurar alianzas y ejecución de campo con orden, seguridad y reputación cuidada.',
      },
      {
        title: 'Executive assistants y operación',
        description:
          'Coordinas agendas, proveedores y detalle. Verás qué debe estar definido antes para que el día del evento no sea improvisación.',
      },
    ],
  },
  queVasAprender: {
    headline: 'Qué vas a llevar de la sesión',
    bullets: [
      'El marco mental: por qué el valor está en el diseño de la experiencia, no solo en “la actividad”.',
      'Los pilares de una experiencia corporativa ambiental: intención, logística, participación, medición y cierre.',
      'Errores comunes que hacen que una iniciativa con propósito se sienta vacía o difícil de repetir.',
      'Cómo pensar en indicadores simples que comuniquen impacto sin complicar al equipo.',
      'Preguntas clave para evaluar si una propuesta está lista para presentarse a liderazgo o a proveedores.',
    ],
  },
  porQueImporta: {
    headline: 'Por qué esta conversación importa ahora',
    paragraphs: [
      'Las empresas en Puerto Rico están buscando formas auténticas de activar cultura y responsabilidad. El reto no es “hacer algo bonito”: es ejecutar con claridad, con seguridad y con un resultado que se pueda contar sin inflar números.',
      'Doce25 ha operado experiencias ambientales a escala real. En esta sesión compartimos cómo pensamos el diseño para que funcione en el mundo corporativo, no solo en el papel.',
    ],
  },
  problema: {
    headline: 'El problema que vemos en el mercado',
    paragraphs: [
      'Muchas iniciativas con propósito se ven bien en foto, pero no están diseñadas para dejar huella: poca claridad de objetivo, logística frágil, poca guía al participante y cero cierre con datos útiles.',
      'El resultado es fatiga interna: “otra actividad más”. La alternativa es estructura: una experiencia que se sienta profesional, inclusiva y repetible.',
    ],
  },
  autoridad: {
    headline: 'Doce25 en operación',
    subline:
      'Experiencias ambientales en Puerto Rico con estándar de ejecución y foco en participación.',
    stats: [
      { value: '20', label: 'eventos ejecutados' },
      { value: '6,291', label: 'participantes movilizados' },
      { value: '73,419.08', label: 'lbs de desperdicios removidos' },
    ],
  },
  speaker: {
    name: 'Equipo Doce25',
    role: 'Diseño y operación de experiencias ambientales',
    bio:
      'Perfil editable: aquí puedes sustituir por Edgardo u otro host con bio corta, logros y enfoque (ej. operación de campo, alianzas corporativas, medición de impacto). Mantén 3–4 líneas para escaneo rápido.',
    photoSrc: null as string | null,
  },
  logos: {
    headline: 'Empresas y equipos que han participado en experiencias con Doce25',
    /** Sustituye por logos reales en /public/... o URLs cuando los tengas */
    items: [
      { name: 'Partner 1', logoSrc: null as string | null },
      { name: 'Partner 2', logoSrc: null as string | null },
      { name: 'Partner 3', logoSrc: null as string | null },
      { name: 'Partner 4', logoSrc: null as string | null },
    ],
  },
  cta: {
    headline: 'Reserva tu cupo',
    subheadline:
      'Te enviaremos confirmación por correo y, antes del evento, el enlace para unirte en vivo.',
    label: 'Completar registro',
  },
  interestOptions: [
    { value: '', label: 'Selecciona (opcional)' },
    { value: 'cultura', label: 'Cultura y engagement' },
    { value: 'csr', label: 'CSR / Sostenibilidad' },
    { value: 'eventos', label: 'Eventos corporativos' },
    { value: 'alianza', label: 'Alianza estratégica' },
    { value: 'otro', label: 'Otro' },
  ],
  faq: [
    {
      q: '¿Cuánto dura el webinar?',
      a: 'Sesión de 60 minutos con espacio para preguntas. Empieza puntual; recomendamos conectarte 5 minutos antes.',
    },
    {
      q: '¿Habrá grabación?',
      a: 'Si hay grabación disponible para equipo interno, lo anunciaremos por correo. El foco de la sesión en vivo es interacción y claridad operativa.',
    },
    {
      q: '¿Sirve si somos una empresa pequeña?',
      a: 'Sí. Los principios aplican a equipos de distintos tamaños; lo que cambia es la escala de logística, no la necesidad de diseño.',
    },
    {
      q: '¿Qué necesito para participar?',
      a: 'Un dispositivo con buena conexión, audio y —si puedes— cámara. El enlace lo recibirás por correo antes del evento.',
    },
    {
      q: '¿Es una venta disfrazada?',
      a: 'No. Es una conversación estratégica para posicionar cómo Doce25 piensa las experiencias corporativas. Si hay fit, podemos agendar una llamada aparte.',
    },
  ],
  thankYou: {
    headline: 'Estás dentro',
    subline: 'Revisa tu correo en los próximos minutos.',
    steps: [
      'Confirma que recibiste el email (revisa spam/promociones).',
      'Añade el evento a tu calendario para bloquear el tiempo.',
      'Reenvía el enlace a alguien de tu equipo que deba estar en la conversación.',
    ],
    resourceTitle: 'Recurso descargable',
    resourceBody:
      'Cuando tengas una guía o checklist, enlázalo aquí desde content.ts (thankYou.resourceHref).',
    resourceHref: null as string | null,
  },
} as const

export type WebinarInterestValue =
  | ''
  | 'cultura'
  | 'csr'
  | 'eventos'
  | 'alianza'
  | 'otro'
