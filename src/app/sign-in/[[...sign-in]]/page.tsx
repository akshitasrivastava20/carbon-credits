'use client'

import { SignIn } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function Page() {
  useEffect(() => {
    // Clean up any redirect-related parameters from the URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const redirectParams = [
        'redirect_url',
        'sign_up_force_redirect_url',
        'sign_in_force_redirect_url',
        'sign_up_fallback_redirect_url',
        'sign_in_fallback_redirect_url'
      ]
      
      let hasChanges = false
      redirectParams.forEach(param => {
        if (url.searchParams.has(param)) {
          url.searchParams.delete(param)
          hasChanges = true
        }
      })
      
      if (hasChanges) {
        window.history.replaceState({}, '', url.toString())
      }
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen p-6 relative z-50" style={{pointerEvents: 'auto'}}>
      <div className="relative z-60" style={{pointerEvents: 'auto'}}>
        <SignIn 
          forceRedirectUrl="/register"
          fallbackRedirectUrl="/register"
        />
      </div>
    </div>
  )
}