const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || ''

export interface RegisterEventData {
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

export async function registerForEvent(eventId: string, data: RegisterEventData, token?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  // Agregar token JWT si el usuario está logueado
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_ENDPOINT}/events/${eventId}/register`, {
    method: 'POST',
    headers,
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
  return data // Devolver el objeto completo con { events: [...] }
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

export async function getEventByShortId(shortId: string) {
  const response = await fetch(`${API_ENDPOINT}/events/short/${shortId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Evento no encontrado')
  }

  const data = await response.json()
  return data.event || data
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

export async function manualCheckIn(registrationId: string) {
  const response = await fetch(`${API_ENDPOINT}/checkin/manual`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ registrationId }),
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

export async function sendAuspiciadorForm(data: {
  companyName: string
  contactName: string
  email: string
  phone?: string
  website?: string
  interestArea?: string
  message?: string
}) {
  const response = await fetch(`${API_ENDPOINT}/forms/auspiciador`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, type: 'auspiciador' }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al enviar solicitud' }))
    throw new Error(error.message || 'Error al enviar solicitud')
  }

  return response.json()
}

export async function sendStaffForm(data: {
  fullName: string
  email: string
  phone?: string
  experience?: string
  availability?: string
  message?: string
}) {
  const response = await fetch(`${API_ENDPOINT}/forms/staff`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, type: 'staff' }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al enviar solicitud' }))
    throw new Error(error.message || 'Error al enviar solicitud')
  }

  return response.json()
}

// ==================== USER AUTH API ====================

export interface RegisterUserData {
  email: string
  password: string
  fullName: string
  phone?: string
  ageRange?: string
  gender?: string
  city?: string
  organization?: string
}

export interface LoginUserData {
  email: string
  password: string
}

export interface UpdateUserProfileData {
  fullName?: string
  phone?: string
  ageRange?: string
  gender?: string
  city?: string
  organization?: string
}

export async function registerUser(data: RegisterUserData) {
  const response = await fetch(`${API_ENDPOINT}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al registrar usuario' }))
    throw new Error(error.message || 'Error al registrar usuario')
  }

  return response.json()
}

export async function loginUser(data: LoginUserData) {
  const response = await fetch(`${API_ENDPOINT}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al iniciar sesión' }))
    throw new Error(error.message || 'Error al iniciar sesión')
  }

  return response.json()
}

export async function getUserProfile(token: string) {
  const response = await fetch(`${API_ENDPOINT}/auth/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener perfil')
  }

  return response.json()
}

export async function updateUserProfile(token: string, data: UpdateUserProfileData) {
  const response = await fetch(`${API_ENDPOINT}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Error al actualizar perfil')
  }

  return response.json()
}

export async function getUserRegistrations(token: string | undefined, userId: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(`${API_ENDPOINT}/users/${userId}/registrations`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    throw new Error('Error al obtener registros')
  }

  return response.json()
}

// ==================== ADMIN API ====================

export async function getAllUsers(token?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(`${API_ENDPOINT}/admin/users`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    throw new Error('Error al obtener usuarios')
  }

  return response.json()
}

// ==================== WEIGHT REGISTRATION API ====================

export interface TrashBreakdown {
  plastic?: number
  metal?: number
  glass?: number
  organic?: number
  other?: number
}

export interface RegisterWeightData {
  weightCollected: number
  trashType: 'plastic' | 'metal' | 'glass' | 'organic' | 'mixed' | 'other'
  trashBreakdown?: TrashBreakdown
  notes?: string
  registeredBy?: string
}

export interface EventStats {
  eventId: string
  totalWeight: number
  participantsCount: number
  totalRegistrations: number
  participationRate: number
  breakdown: TrashBreakdown
  topParticipants: Array<{
    rank: number
    name: string
    weight: number
    organization: string
    trashType: string
  }>
  trashTypeCounts: Record<string, number>
  lastUpdated: string
}

export interface SearchResult {
  registrationId: string
  name: string
  email: string
  organization: string
  checkedIn: boolean
  checkedOut: boolean
  weightCollected: number | null
  phone: string
}

// Registrar peso de un participante
export async function registerWeight(
  registrationId: string,
  data: RegisterWeightData
) {
  const response = await fetch(
    `${API_ENDPOINT}/registrations/${registrationId}/register-weight`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error registrando peso' }))
    throw new Error(error.message || 'Error registrando peso')
  }

  return response.json()
}

// Buscar registros por nombre/organización
export async function searchRegistrations(
  eventId: string,
  query: string
): Promise<{ results: SearchResult[]; total: number; showing: number; query: string }> {
  const response = await fetch(
    `${API_ENDPOINT}/events/${eventId}/search?q=${encodeURIComponent(query)}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error buscando registros' }))
    throw new Error(error.message || 'Error buscando registros')
  }

  return response.json()
}

// Obtener estadísticas del evento
export async function getEventStats(eventId: string): Promise<EventStats> {
  const response = await fetch(`${API_ENDPOINT}/events/${eventId}/stats`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error obteniendo estadísticas' }))
    throw new Error(error.message || 'Error obteniendo estadísticas')
  }

  return response.json()
}

// Actualizar peso (admin only)
export async function updateWeight(
  registrationId: string,
  data: RegisterWeightData,
  token?: string
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(
    `${API_ENDPOINT}/registrations/${registrationId}/weight`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error actualizando peso' }))
    throw new Error(error.message || 'Error actualizando peso')
  }

  return response.json()
}

// Eliminar peso (admin only)
export async function deleteWeight(registrationId: string, token?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(
    `${API_ENDPOINT}/registrations/${registrationId}/weight`,
    {
      method: 'DELETE',
      headers,
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error eliminando peso' }))
    throw new Error(error.message || 'Error eliminando peso')
  }

  return response.json()
}

// Group Management Functions

export interface UpdateGroupData {
  participationType: 'individual' | 'duo' | 'group' | 'organization'
  eventOrganization?: string
  groupMembers?: string[]
  groupId?: string
}

export interface GroupInfo {
  groupId: string
  participationType: string
  eventOrganization?: string
  members: Array<{
    registrationId: string
    name: string
    email: string
    checkedIn: boolean
  }>
  weightHistory: any[]
  totalWeight: number
  tripCount: number
}

export interface WeightHistory {
  records: any[]
  totalWeight: number
  tripCount: number
  summary: {
    byType: Record<string, number>
  }
}

// Actualizar información del grupo
export async function updateCheckInGroup(
  registrationId: string,
  data: UpdateGroupData
) {
  const response = await fetch(
    `${API_ENDPOINT}/registrations/${registrationId}/group`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error actualizando grupo' }))
    throw new Error(error.message || 'Error actualizando grupo')
  }

  return response.json()
}

// Obtener información del grupo
export async function getGroupInfo(groupId: string): Promise<GroupInfo> {
  const response = await fetch(`${API_ENDPOINT}/groups/${groupId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error obteniendo info del grupo' }))
    throw new Error(error.message || 'Error obteniendo info del grupo')
  }

  return response.json()
}

// Obtener historial de peso
export async function getWeightHistory(
  id: string,
  type: 'registration' | 'group' = 'registration'
): Promise<WeightHistory> {
  const endpoint = type === 'group'
    ? `${API_ENDPOINT}/groups/${id}/weight-history`
    : `${API_ENDPOINT}/registrations/${id}/weight-history`

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error obteniendo historial' }))
    throw new Error(error.message || 'Error obteniendo historial')
  }

  return response.json()
}