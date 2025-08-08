'use client'

import { useState, useEffect } from 'react'

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      setIsLoaded(true)
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      setLoadError('Google Maps API key is missing')
      return
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      // Script is already loading, wait for it
      const checkLoaded = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsLoaded(true)
          clearInterval(checkLoaded)
        }
      }, 100)

      // Clear interval after 30 seconds
      setTimeout(() => {
        clearInterval(checkLoaded)
        if (!isLoaded) {
          setLoadError('Google Maps script failed to load. Please check your billing settings.')
        }
      }, 30000)

      return
    }

    // Create and load the script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true

    script.onload = () => {
      // Double check that google maps is actually available
      if (window.google && window.google.maps) {
        setIsLoaded(true)
      } else {
        setLoadError('Google Maps API loaded but not available. Please check your billing settings.')
      }
    }

    script.onerror = (error) => {
      console.error('Google Maps script failed to load:', error)
      setLoadError('Failed to load Google Maps. This is usually due to billing not being enabled.')
    }

    // Listen for specific Google Maps errors
    window.addEventListener('error', (event) => {
      if (event.message && event.message.includes('BillingNotEnabledMapError')) {
        setLoadError('Billing not enabled for Google Maps API')
      }
    })

    document.head.appendChild(script)

    // Cleanup function
    return () => {
      const scriptToRemove = document.querySelector('script[src*="maps.googleapis.com"]')
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove)
      }
    }
  }, [isLoaded])

  return { isLoaded, loadError }
}

// Extend Window interface to include google
declare global {
  interface Window {
    google: typeof google
  }
}
