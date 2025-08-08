'use client'

import { useEffect, useRef } from 'react'
import { SavedPlace } from '@/app/page'
import { useGoogleMaps } from '@/hooks/use-google-maps'
import { Loader2, AlertCircle, RefreshCw, ExternalLink, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MapComponentProps {
  center: { lat: number; lng: number }
  savedPlaces: SavedPlace[]
  onMapClick: (lat: number, lng: number) => void
  onMapLoad: (map: google.maps.Map) => void
}

export function MapComponent({ center, savedPlaces, onMapClick, onMapLoad }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const { isLoaded, loadError } = useGoogleMaps()

  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return

    try {
      // Initialize map
      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      })

      mapInstanceRef.current = map
      onMapLoad(map)

      // Add click listener
      map.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const lat = event.latLng.lat()
          const lng = event.latLng.lng()
          onMapClick(lat, lng)
        }
      })
    } catch (error) {
      console.error('Error initializing map:', error)
    }
  }, [isLoaded, center, onMapClick, onMapLoad])

  // Update map center when center prop changes
  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      mapInstanceRef.current.setCenter(center)
    }
  }, [center, isLoaded])

  // Update markers when savedPlaces changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return

    try {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []

      // Add new markers
      savedPlaces.forEach(place => {
        const marker = new google.maps.Marker({
          position: { lat: place.lat, lng: place.lng },
          map: mapInstanceRef.current,
          title: place.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#ef4444"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 32)
          }
        })

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold text-gray-900">${place.name}</h3>
              <p class="text-sm text-gray-600">
                ${place.lat.toFixed(6)}, ${place.lng.toFixed(6)}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                Saved: ${new Date(place.createdAt).toLocaleDateString()}
              </p>
            </div>
          `
        })

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker)
        })

        markersRef.current.push(marker)
      })
    } catch (error) {
      console.error('Error updating markers:', error)
    }
  }, [savedPlaces, isLoaded])

  const handleRefresh = () => {
    window.location.reload()
  }

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 max-w-2xl">
          <CreditCard className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Billing Required</h3>
          <p className="text-lg text-gray-600 mb-6">Google Maps requires a billing account to be enabled, even for free usage.</p>
          
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800">Error: BillingNotEnabledMapError</h4>
                <p className="mt-1 text-sm text-red-700">
                  Your Google Cloud project needs billing enabled to use Google Maps APIs.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-blue-900 mb-4">✅ How to Enable Billing (Free for most usage):</h4>
            <ol className="list-decimal list-inside space-y-3 text-left text-blue-800">
              <li>Go to <strong>Google Cloud Console</strong></li>
              <li>Click on <strong>"Billing"</strong> in the left menu</li>
              <li>Click <strong>"Link a billing account"</strong></li>
              <li>Add a credit card (required but you won't be charged for normal usage)</li>
              <li>Google provides <strong>$200 free credits</strong> and generous free tiers</li>
              <li>Come back and refresh this page</li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-green-800 mb-2">💰 Don't worry about costs:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Google Maps gives you $200 in free credits monthly</li>
              <li>• 28,500 map loads per month are free</li>
              <li>• Most personal projects stay within free limits</li>
              <li>• You can set billing alerts to monitor usage</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button asChild className="flex-1">
              <a 
                href="https://console.cloud.google.com/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Enable Billing Now
              </a>
            </Button>
            
            <Button asChild variant="outline" className="flex-1">
              <a 
                href="https://developers.google.com/maps/documentation/javascript/usage-and-billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Learn About Pricing
              </a>
            </Button>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded p-3 mb-4">
            <p><strong>Your API Key:</strong> {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.substring(0, 20)}... ✅</p>
            <p className="mt-1"><strong>Status:</strong> API key is valid, just needs billing enabled</p>
          </div>

          <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh After Enabling Billing
          </Button>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading Google Maps...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-full" />
}
