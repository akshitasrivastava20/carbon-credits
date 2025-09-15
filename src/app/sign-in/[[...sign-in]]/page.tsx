import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen p-6 relative z-50" style={{pointerEvents: 'auto'}}>
      <div className="relative z-60" style={{pointerEvents: 'auto'}}>
        <SignIn fallbackRedirectUrl="/register" />
      </div>
    </div>
  )
}