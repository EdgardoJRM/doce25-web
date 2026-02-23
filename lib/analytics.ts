// Google Analytics 4 Script
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ''

// Tracking de pageviews
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Tracking de eventos personalizados
interface EventParams {
  action: string
  category: string
  label?: string
  value?: number
}

export const event = ({ action, category, label, value }: EventParams) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Eventos específicos de Doce25
export const trackEventRegistration = (eventName: string, eventId: string) => {
  event({
    action: 'event_registration',
    category: 'Engagement',
    label: `${eventName} (${eventId})`,
  })
}

export const trackDonationClick = (source: string) => {
  event({
    action: 'donation_click',
    category: 'Conversion',
    label: source,
  })
}

export const trackContactFormSubmit = () => {
  event({
    action: 'contact_form_submit',
    category: 'Engagement',
    label: 'Contact Form',
  })
}

export const trackMapInteraction = (municipality: string) => {
  event({
    action: 'map_interaction',
    category: 'Engagement',
    label: municipality,
  })
}

export const trackBannerClick = (eventName: string) => {
  event({
    action: 'banner_click',
    category: 'Engagement',
    label: eventName,
  })
}

