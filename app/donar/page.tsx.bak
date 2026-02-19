import { redirect } from 'next/navigation'
import { Metadata } from 'next'

const PAYPAL_DONATE_URL = 'https://www.paypal.com/donate/?hosted_button_id=A8X4ZTZDF8F5N'

export const metadata: Metadata = {
  title: 'Donar | Apoya la Conservación Marina',
  description: 'Haz una donación deducible de impuestos a Doce25. Somos una organización 501(c)(3). Tu apoyo ayuda a mantener las playas de Puerto Rico limpias y protege la vida marina.',
  openGraph: {
    title: 'Dona a Doce25 - Limpieza de Playas PR',
    description: 'Tu donación es 100% deducible de impuestos. Ayuda a mantener nuestras playas limpias.',
    type: 'website',
  },
}

export default function DonarPage() {
  redirect(PAYPAL_DONATE_URL)
}
