import { NextRequest, NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { decode } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/server-auth'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const headerStack = await headers()
    
    // 1. Basic Env Info
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      HAS_NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      HAS_JWT_SECRET: !!process.env.JWT_SECRET,
    }

    // 2. Cookie Info (Names and existence, NOT values for security)
    const cookieData = cookieStore.getAll().map(c => ({
      name: c.name,
      exists: true,
      size: c.value.length
    }))

    // 3. Header Info
    const host = headerStack.get('host')
    const xForwardedHost = headerStack.get('x-forwarded-host')
    const xForwardedProto = headerStack.get('x-forwarded-proto')

    // 4. Try manual decode to see where it fails
    const secureToken = cookieStore.get('__Secure-next-auth.session-token')?.value
    const normalToken = cookieStore.get('next-auth.session-token')?.value
    const nextAuthToken = secureToken || normalToken
    const salt = secureToken ? '__Secure-next-auth.session-token' : 'next-auth.session-token'
    
    let decodeResult = null
    let decodeError = null
    
    if (nextAuthToken && process.env.NEXTAUTH_SECRET) {
      try {
        decodeResult = await decode({
          token: nextAuthToken,
          secret: process.env.NEXTAUTH_SECRET,
          salt: salt
        })
      } catch (e: any) {
        decodeError = e.message
      }
    }

    // 5. Check Database Connection
    let dbStatus = 'Unknown'
    try {
      await prisma.$connect()
      dbStatus = 'Connected'
    } catch (e: any) {
      dbStatus = 'Error: ' + e.message
    }

    // 6. Test the actual wrapper
    const session = await getServerSession()

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: env,
      headers: {
        host,
        'x-forwarded-host': xForwardedHost,
        'x-forwarded-proto': xForwardedProto
      },
      cookies: cookieData,
      nextAuth: {
        hasToken: !!nextAuthToken,
        usedSalt: salt,
        decodeError,
        isDecoded: !!decodeResult,
        decodedRole: decodeResult ? (decodeResult as any).role : null
      },
      database: {
        status: dbStatus
      },
      finalSession: {
        exists: !!session,
        userRole: session?.user?.role || null,
        userEmail: session?.user?.email || null
      }
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
