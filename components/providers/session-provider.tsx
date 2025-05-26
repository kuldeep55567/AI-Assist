'use client'

import { SessionProvider } from "next-auth/react"

type AuthProviderProps = {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider 
      // Force the session to refresh at least every 5 minutes
      refetchInterval={5 * 60}
      // Refetch on window focus to ensure session is always up to date
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  )
}