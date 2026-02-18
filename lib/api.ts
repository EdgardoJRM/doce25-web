const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || ''

interface RegisterEventData {
  name: string
  email: string
  phone?: string
  fullName?: string
  ageRange?: string
  gender?: string
  city?: string
  organization?: string
  otherOrganization?: string
  termsAccepted?: boolean
  signature?: string
  signatureDate?: string
}

interface CreateEventData {
  name: string
  slug: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  imageUrl?: string
  status: 'draft' | 'published' | 'cancelled'
}

interface UpdateEventData {
  name?: string
  slug?: string
  description?: string
  date?: string
  time?: string
  location?: string
  capacity?: number
  imageUrl?: string
  status?: 'draft' | 'published' | 'cancelled'
}

interface UpdateRegistrationData {
  name?: string
  email?: string
  phone?: string
}

export async function registerForEvent(eventId: string, data: RegisterEventData) {
  const response = await fetch(`${API_ENDPOINT}/events/${eventId}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al registrarse' }))
    throw new Error(error.message || 'Error al registrarse')
  }

  return response.json()
}

export async function getEvents() {
  const response = await fetch(`${API_ENDPOINT}/events`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al cargar eventos')
  }

  const data = await response.json()
  return data.events || []
}

export async function getEventBySlug(slug: string) {
  const response = await fetch(`${API_ENDPOINT}/events/slug/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Evento no encontrado')
  }

  const data = await response.json()
  return data.event
}

export async function getRegistrations(eventId: string) {
  const response = await fetch(`${API_ENDPOINT}/events/${eventId}/registrations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al cargar registros')
  }

  return response.json()
}

export async function checkIn(token: string) {
  const response = await fetch(`${API_ENDPOINT}/checkin/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en check-in' }))
    throw new Error(error.message || 'Error en check-in')
  }

  return response.json()
}

export async function createEvent(data: CreateEventData) {
  const response = await fetch(`${API_ENDPOINT}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear evento' }))
    throw new Error(error.message || 'Error al crear evento')
  }

  return response.json()
}

export async function updateEvent(eventId: string, data: UpdateEventData) {
  const response = await fetch(`${API_ENDPOINT}/events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar evento' }))
    throw new Error(error.message || 'Error al actualizar evento')
  }

  return response.json()
}

export async function getEventById(eventId: string) {
  const response = await fetch(`${API_ENDPOINT}/events/${eventId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Evento no encontrado')
  }

  return response.json()
}

export async function deleteEvent(eventId: string) {
  const response = await fetch(`${API_ENDPOINT}/events/${eventId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al eliminar evento' }))
    throw new Error(error.message || 'Error al eliminar evento')
  }

  return response.json()
}

export async function updateRegistration(registrationId: string, data: UpdateRegistrationData) {
  const response = await fetch(`${API_ENDPOINT}/registrations/${registrationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar registro' }))
    throw new Error(error.message || 'Error al actualizar registro')
  }

  return response.json()
}

export async function deleteRegistration(registrationId: string) {
  const response = await fetch(`${API_ENDPOINT}/registrations/${registrationId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al eliminar registro' }))
    throw new Error(error.message || 'Error al eliminar registro')
  }

  return response.json()
}

export async function resendQREmail(registrationId: string) {
  const response = await fetch(`${API_ENDPOINT}/registrations/${registrationId}/resend-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al reenviar QR' }))
    throw new Error(error.message || 'Error al reenviar QR')
  }

  return response.json()
}

export async function sendContactEmail(data: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}) {
  const response = await fetch(`${API_ENDPOINT}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al enviar mensaje' }))
    throw new Error(error.message || 'Error al enviar mensaje')
  }

  return response.json()
}
