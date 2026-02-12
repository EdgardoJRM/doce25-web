const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || ''

interface RegisterEventData {
  name: string
  email: string
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

  return response.json()
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

  return response.json()
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

