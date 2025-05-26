import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Check if the route is admin route
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  // Check if the route requires authentication
  const requiresAuth = isAdminRoute ||
    request.nextUrl.pathname.startsWith('/interview') ||
    request.nextUrl.pathname.startsWith('/quiz')

  // First try to get the session token from NextAuth
  const sessionToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const jwtToken = request.cookies.get('token')?.value

  // Fallback to JWT token in cookie if session token doesn't exist
  // If accessing a protected route and no auth is present
  if (requiresAuth && !sessionToken && !jwtToken) {
    // Redirect to login if no token
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // For admin routes, verify admin role
  if (isAdminRoute) {
    // Check NextAuth session first
    if (sessionToken && sessionToken.role === 'admin') {
      return NextResponse.next()
    }

    // If no session token or not admin, try JWT
    if (jwtToken) {
      try {
        // Verify the JWT token
        const decoded = verify(jwtToken, process.env.JWT_SECRET!) as { role: string }

        // Check if user has admin role
        if (decoded.role === 'admin') {
          return NextResponse.next()
        }
      } catch (error) {
        // Token is invalid, redirect to login
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    // No valid admin token found, redirect to home
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Run middleware on protected routes
export const config = {
  matcher: ['/admin/:path*', '/interview/:path*', '/quiz/:path*'],
}