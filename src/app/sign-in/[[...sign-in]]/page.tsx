'use client'

import { SignIn } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function Page() {
  useEffect(() => {
    // Aggressive cleanup - remove ALL URL parameters
    if (typeof window !== 'undefined') {
      const cleanUrl = window.location.origin + window.location.pathname
      window.history.replaceState({}, '', cleanUrl)
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen p-6 relative z-50" style={{pointerEvents: 'auto'}}>
      <div className="relative z-60" style={{pointerEvents: 'auto'}}>
        <SignIn 
          forceRedirectUrl="/register"
        />
      </div>
    </div>
  )
}