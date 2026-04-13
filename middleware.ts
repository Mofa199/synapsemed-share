import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/courses',
    '/library',
    '/pharmacology',
    '/auth',
    '/login',
    '/debug-auth',
    '/auth-debug',
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/logout',
    '/_next',
    '/favicon.ico',
    '/images',
    '/public'
  ]

  // Protected routes that require authentication
  const protectedRoutes = [
    '/profile',
    '/topics',
    '/topic',
    '/module',
    '/learning-resources',
    '/question-bank',
    '/study-guide',
    '/drug',
    '/drug-class',
    '/drugs',
    '/dashboard',
    '/3d-models',
    '/student/dashboard',
    '/student/ai-tutor',
    '/student/chat',
    '/student/concepts',
    '/student/content',
    '/student/exam-simulation',
    '/student/planner',
    '/student/questions',
    '/student/simulations',
    '/student/videos'
  ]

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

  // If it's a public route, allow access
  if (isPublicRoute && !protectedRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Get user info from cookies
  const nextAuthToken = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token')
  const token = request.cookies.get('auth-token') || nextAuthToken
  const user = request.cookies.get('synapse-user')

  // Debug logging for admin routes
  if (pathname.startsWith('/admin')) {
    console.log('=== MIDDLEWARE ADMIN ACCESS DEBUG ===')
    console.log('Path:', pathname)
    console.log('Has auth-token cookie:', !!token)
    console.log('Has synapse-user cookie:', !!user)

    if (token) {
      console.log('Token value:', token.value)
    }

    if (user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user.value))
        console.log('User data:', userData)
        console.log('User role:', userData.role)
        console.log('Is admin role?', ['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(userData.role))
      } catch (e) {
        console.log('Failed to parse user cookie:', e)
      }
    }
    console.log('=======================================')
  }

  // Admin routes that require admin privileges (Super Admin, Lecturer, Editor)
  const adminRoutes = ['/admin']

  // Super Admin only routes
  const superAdminRoutes = ['/admin/users', '/admin/analytics', '/admin/team']

  // Student routes
  const studentRoutes = ['/student']

  // Check if trying to access protected routes
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  const isSuperAdminRoute = superAdminRoutes.some(route => pathname.startsWith(route))

  const isStudentRoute = studentRoutes.some(route => pathname.startsWith(route))

  // If accessing protected routes without authentication, redirect to login
  if (isProtectedRoute || isAdminRoute || isStudentRoute) {

    if (!user || !token) {
      console.log('Redirecting to login - no auth')
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    // Parse user data if available
    let userData: any = null
    if (user) {
      try {
        userData = JSON.parse(decodeURIComponent(user.value))
        console.log('Parsed user data:', userData)
      } catch (e) {
        console.log('Failed to parse user cookie, redirecting to login')
        return NextResponse.redirect(new URL('/auth', request.url))
      }
    }

    // Check role-based access for admin routes
    if (isAdminRoute && userData) {
      console.log('Checking admin access for user:', userData.role)
      const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
      if (!adminRoles.includes(userData.role)) {
        console.log('Redirecting to home - insufficient admin privileges')
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Check super admin access
    if (isSuperAdminRoute && userData) {
      if (userData.role !== 'SUPER_ADMIN') {
        console.log('Redirecting to home - insufficient super admin privileges')
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Check student access
    if (isStudentRoute && userData) {
      const studentRoles = ['STUDENT', 'MEDICAL', 'NURSING', 'PHARMACY']
      if (!studentRoles.includes(userData.role)) {
        console.log('Redirecting to home - insufficient student privileges')
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}