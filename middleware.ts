import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = 120; // 120 requests per minute
  const windowMs = 60 * 1000;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true; // Allowed
  }

  if (record.count >= limit) {
    return false; // Rate limited
  }

  record.count += 1;
  return true; // Allowed
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Rate Limit API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
    if (ip !== 'unknown' && !checkRateLimit(ip)) {
      return new NextResponse(JSON.stringify({ error: "Too Many Requests. Rate limit exceeded." }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/privacy',
    '/terms',
    '/courses',
    '/library',
    '/calculators',
    '/osce-simulator',
    '/pharmacology',
    '/auth',
    '/login',
    '/debug-auth',
    '/auth-debug',
    '/api/debug-auth',
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

  // Response object construction
  let response = NextResponse.next()

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

  // Get user info from cookies
  const nextAuthToken = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token')
  const token = request.cookies.get('auth-token') || nextAuthToken
  const user = request.cookies.get('synapse-user')

  // Check route restrictions
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = pathname.startsWith('/admin')
  const isSuperAdminRoute = ['/admin/users', '/admin/analytics', '/admin/team'].some(route => pathname.startsWith(route))
  const isStudentRoute = pathname.startsWith('/student')

  // If accessing protected routes without authentication, redirect to login
  if (!isPublicRoute && (isProtectedRoute || isAdminRoute || isStudentRoute)) {
    if (!user || !token) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    let userData: any = null
    if (user) {
      try {
        userData = JSON.parse(decodeURIComponent(user.value))
      } catch (e) {
        return NextResponse.redirect(new URL('/auth', request.url))
      }
    }

    if (isAdminRoute && userData) {
      const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
      if (!adminRoles.includes(userData.role)) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    if (isSuperAdminRoute && userData) {
      if (userData.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  // Inject Security & Performance Headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  return response
}

export const config = {
  matcher: [
    '/((?!api/auth|api/debug-auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}