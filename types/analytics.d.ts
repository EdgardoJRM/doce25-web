// Type definitions for Google Analytics gtag.js
interface Window {
  gtag?: (
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string,
    config?: Record<string, any>
  ) => void
  dataLayer?: any[]
  fbq?: (
    command: 'init' | 'track' | 'trackCustom',
    eventName: string,
    parameters?: Record<string, any>
  ) => void
  _fbq?: any
}

