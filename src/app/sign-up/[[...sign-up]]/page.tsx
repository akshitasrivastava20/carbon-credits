'use client'

import { SignUp } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function Page() {
  useEffect(() => {
    // Clean up any redirect_url parameters from the URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (url.searchParams.has('redirect_url')) {
        url.searchParams.delete('redirect_url')
        window.history.replaceState({}, '', url.toString())
      }
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen p-6 relative z-50" style={{pointerEvents: 'auto'}}>
      <div className="relative z-60" style={{pointerEvents: 'auto'}}>
        <SignUp />
      </div>
    </div>
  )
}