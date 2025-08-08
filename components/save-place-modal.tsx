'use client'

import { useState, useEffect } from 'react'
import { MapPin, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SavePlaceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string) => void
  coordinates: { lat: number; lng: number } | null
}

export function SavePlaceModal({ isOpen, onClose, onSave, coordinates }: SavePlaceModalProps) {
  const [placeName, setPlaceName] = useState('')

  useEffect(() => {
    if (isOpen) {
      setPlaceName('')
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (placeName.trim()) {
      onSave(placeName.trim())
      setPlaceName('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-500" />
            Save This Place
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {coordinates && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>Coordinates:</strong><br />
              {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="placeName" className="text-sm font-medium text-gray-700">
              Place Name
            </Label>
            <Input
              id="placeName"
              type="text"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              placeholder="e.g., Mom's House, Favorite Cafe..."
              className="mt-1"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!placeName.trim()}
              className="flex-1"
            >
              Save Place
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
