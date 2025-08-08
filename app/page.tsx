'use client'

import { useState, useEffect, useRef } from 'react'
import { MapComponent } from '@/components/map-component'
import { Sidebar } from '@/components/sidebar'
import { SearchBar } from '@/components/search-bar'
import { SavePlaceModal } from '@/components/save-place-modal'
import { EnvSetupWarning } from './env-setup'

export interface SavedPlace {
  id: string
  name: string
  lat: number
  lng: number
  createdAt: string
}

export default function MyPlacesApp() {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([])
  const [selectedPlace, setSelectedPlace] = useState<{ lat: number; lng: number } | null>(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: -1.286389, lng: 36.817223 }) // Nairobi
  const mapRef = useRef<google.maps.Map | null>(null)

  // Load saved places from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem('myPlaces')
    if (stored) {
      setSavedPlaces(JSON.parse(stored))
    }
  }, [])

  // Save places to localStorage whenever savedPlaces changes
  useEffect(() => {
    localStorage.setItem('myPlaces', JSON.stringify(savedPlaces))
  }, [savedPlaces])

  // Add this useEffect after the existing ones to get user's current location
  useEffect(() => {
    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setMapCenter(userLocation)
        },
        (error) => {
          console.log('Location access denied, using default location (Nairobi)')
          // Keep default Nairobi location
        }
      )
    }
  }, [])

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedPlace({ lat, lng })
    setShowSaveModal(true)
  }

  const handleSavePlace = (name: string) => {
    if (selectedPlace) {
      const newPlace: SavedPlace = {
        id: Date.now().toString(),
        name,
        lat: selectedPlace.lat,
        lng: selectedPlace.lng,
        createdAt: new Date().toISOString()
      }
      setSavedPlaces(prev => [...prev, newPlace])
      setShowSaveModal(false)
      setSelectedPlace(null)
    }
  }

  const handleDeletePlace = (id: string) => {
    setSavedPlaces(prev => prev.filter(place => place.id !== id))
  }

  const handlePlaceSelect = (place: SavedPlace) => {
    setMapCenter({ lat: place.lat, lng: place.lng })
    if (mapRef.current) {
      mapRef.current.panTo({ lat: place.lat, lng: place.lng })
      mapRef.current.setZoom(15)
    }
  }

  const handleSearchSelect = (lat: number, lng: number) => {
    setMapCenter({ lat, lng })
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng })
      mapRef.current.setZoom(15)
    }
  }

  return (
    <>
      <EnvSetupWarning />
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar
          savedPlaces={savedPlaces}
          onPlaceSelect={handlePlaceSelect}
          onDeletePlace={handleDeletePlace}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header with Search */}
          <div className="bg-white shadow-sm border-b p-4">
            <div className="max-w-md">
              <SearchBar onPlaceSelect={handleSearchSelect} />
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            <MapComponent
              center={mapCenter}
              savedPlaces={savedPlaces}
              onMapClick={handleMapClick}
              onMapLoad={(map) => { mapRef.current = map }}
            />
          </div>
        </div>

        {/* Save Place Modal */}
        <SavePlaceModal
          isOpen={showSaveModal}
          onClose={() => {
            setShowSaveModal(false)
            setSelectedPlace(null)
          }}
          onSave={handleSavePlace}
          coordinates={selectedPlace}
        />
      </div>
    </>
  )
}
