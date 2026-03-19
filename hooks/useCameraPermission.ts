'use client'

import { useEffect, useRef, useState } from 'react'

const CAMERA_PERMISSION_KEY = 'doce25_camera_permission'

interface CameraPermissionState {
  status: 'granted' | 'denied' | 'prompt' | 'unknown'
  lastChecked: number
}

export function useCameraPermission() {
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown')
  const [isChecking, setIsChecking] = useState(false)
  const permissionCheckRef = useRef(false)

  // Check camera permission using Permissions API
  const checkPermission = async () => {
    if (permissionCheckRef.current) return
    permissionCheckRef.current = true

    try {
      // Try using the Permissions API (modern browsers)
      if ('permissions' in navigator) {
        try {
          const result = await navigator.permissions.query({ name: 'camera' as PermissionName })
          const status = result.state as 'granted' | 'denied' | 'prompt'
          
          // Cache the permission status
          const cacheData: CameraPermissionState = {
            status,
            lastChecked: Date.now(),
          }
          localStorage.setItem(CAMERA_PERMISSION_KEY, JSON.stringify(cacheData))
          setPermissionStatus(status)
          
          // Listen for permission changes
          result.addEventListener('change', () => {
            const newStatus = result.state as 'granted' | 'denied' | 'prompt'
            setPermissionStatus(newStatus)
            const updatedCache: CameraPermissionState = {
              status: newStatus,
              lastChecked: Date.now(),
            }
            localStorage.setItem(CAMERA_PERMISSION_KEY, JSON.stringify(updatedCache))
          })
          
          return status
        } catch (err) {
          // Permissions API not available for camera, try cached value
          const cached = getCachedPermission()
          if (cached) {
            setPermissionStatus(cached.status)
            return cached.status
          }
        }
      }
      
      // Fallback: check cached permission
      const cached = getCachedPermission()
      if (cached) {
        setPermissionStatus(cached.status)
        return cached.status
      }
      
      setPermissionStatus('unknown')
      return 'unknown'
    } finally {
      permissionCheckRef.current = false
    }
  }

  // Get cached permission status
  const getCachedPermission = (): CameraPermissionState | null => {
    try {
      const cached = localStorage.getItem(CAMERA_PERMISSION_KEY)
      if (cached) {
        return JSON.parse(cached)
      }
    } catch (err) {
      console.error('Error reading cached permission:', err)
    }
    return null
  }

  // Cache permission status after successful camera access
  const cachePermissionGranted = () => {
    const cacheData: CameraPermissionState = {
      status: 'granted',
      lastChecked: Date.now(),
    }
    localStorage.setItem(CAMERA_PERMISSION_KEY, JSON.stringify(cacheData))
    setPermissionStatus('granted')
  }

  // Cache permission denied
  const cachePermissionDenied = () => {
    const cacheData: CameraPermissionState = {
      status: 'denied',
      lastChecked: Date.now(),
    }
    localStorage.setItem(CAMERA_PERMISSION_KEY, JSON.stringify(cacheData))
    setPermissionStatus('denied')
  }

  // Clear cached permission
  const clearCachedPermission = () => {
    localStorage.removeItem(CAMERA_PERMISSION_KEY)
    setPermissionStatus('unknown')
  }

  // Check permission on mount
  useEffect(() => {
    checkPermission()
  }, [])

  return {
    permissionStatus,
    isChecking,
    checkPermission,
    cachePermissionGranted,
    cachePermissionDenied,
    clearCachedPermission,
    getCachedPermission,
  }
}
