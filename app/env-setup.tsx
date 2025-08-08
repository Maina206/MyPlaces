'use client'

import { AlertTriangle, ExternalLink, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EnvSetupWarning() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // Don't show anything if API key exists - let the map component handle loading
  if (apiKey) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
          <h2 className="text-lg font-semibold">Google Maps API Key Required</h2>
        </div>
        
        <div className="space-y-4 text-sm text-gray-600">
          <p>To use this app, you need to set up a Google Maps API key:</p>
          
          <ol className="list-decimal list-inside space-y-2">
            <li>Go to Google Cloud Console</li>
            <li>Create a project and enable Maps JavaScript API & Places API</li>
            <li>Create an API key</li>
            <li>Add it to your <code className="bg-gray-100 px-1 rounded">.env.local</code> file:</li>
          </ol>
          
          <div className="bg-gray-100 p-3 rounded font-mono text-xs">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
          </div>
          
          <Button asChild className="w-full">
            <a 
              href="https://console.cloud.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Open Google Cloud Console
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
