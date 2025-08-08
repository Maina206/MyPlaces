'use client'

import { MapPin, Trash2, Navigation } from 'lucide-react'
import { SavedPlace } from '@/app/page'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SidebarProps {
  savedPlaces: SavedPlace[]
  onPlaceSelect: (place: SavedPlace) => void
  onDeletePlace: (id: string) => void
}

export function Sidebar({ savedPlaces, onPlaceSelect, onDeletePlace }: SidebarProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="h-6 w-6 text-red-500" />
          My Places
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {savedPlaces.length} saved location{savedPlaces.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Places List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {savedPlaces.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No places saved yet</p>
              <p className="text-gray-400 text-xs mt-1">
                Click on the map to add your first place
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {savedPlaces.map((place) => (
                <div
                  key={place.id}
                  className="group bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {place.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(place.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onPlaceSelect(place)}
                        className="h-8 w-8 p-0"
                      >
                        <Navigation className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeletePlace(place.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Instructions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 space-y-1">
          <p>💡 <strong>Tips:</strong></p>
          <p>• Click anywhere on the map to add a place</p>
          <p>• Use the search bar to find locations</p>
          <p>• Click the navigation icon to center on a place</p>
        </div>
      </div>
    </div>
  )
}
