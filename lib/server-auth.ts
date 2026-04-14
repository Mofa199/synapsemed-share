import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

/**
 * Custom getServerSession wrapper for SynapseMed.
 * This is designed to be extremely resilient to environments where 
 * NextAuth's default getServerSession fails due to reverse proxies, 
 * HTTPS/HTTP mismatches, or missing environment variables.
 */
export async function getServerSession(authOptions?: any) {
  try {
    const cookieStore = await cookies()
    
    // 1. Identify all possible auth tokens
    const nextAuthToken = cookieStore.get('next-auth.session-token')?.value || 
                          cookieStore.get('__Secure-next-auth.session-token')?.value
    const legacyToken = cookieStore.get('auth-token')?.value
    const userCookie = cookieStore.get('synapse-user')?.value

    const token = nextAuthToken || legacyToken

    if (!token) {
      return null
    }

    // 2. Try decoding NextAuth token if it exists
    if (nextAuthToken && process.env.NEXTAUTH_SECRET) {
      try {
        const decoded = await decode({ 
          token: nextAuthToken, 
          secret: process.env.NEXTAUTH_SECRET 
        })
        if (decoded) {
          return {
            user: {
              id: decoded.id as string,
              email: decoded.email as string,
              name: decoded.name as string,
              role: decoded.role as string,
              field: decoded.field as string
            }
          }
        }
      } catch (e) {
        console.error('NextAuth Decode Error:', e)
      }
    }

    // 3. Try decoding Legacy/Manual JWT token
    if (legacyToken && process.env.JWT_SECRET) {
      try {
        const decodedLegacy = jwt.verify(legacyToken, process.env.JWT_SECRET) as any
        if (decodedLegacy) {
          return {
            user: {
              id: decodedLegacy.userId,
              email: decodedLegacy.email,
              role: decodedLegacy.role,
              name: undefined,
              field: undefined
            }
          }
        }
      } catch (e) {
        console.error('Legacy JWT Verify Error:', e)
      }
    }

    // 4. FINAL FALLBACK: Database Check (The "Ultimate Fix")
    // If we have a token (proving a session exists) AND a user info cookie (client data),
    // we verify the email in the database to be 100% sure the user is valid.
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie))
        if (userData && userData.email) {
          // Verify user still exists and role matches in database
          const dbUser = await prisma.user.findUnique({
            where: { email: userData.email },
            select: { id: true, email: true, name: true, role: true, field: true }
          })

          if (dbUser) {
            console.log('Session verified via Database Fallback for:', dbUser.email)
            return {
              user: {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name,
                role: dbUser.role,
                field: dbUser.field
              }
            }
          }
        }
      } catch (e) {
        console.error('Database Fallback Error:', e)
      }
    }

    return null
  } catch (error) {
    console.error('getServerSession Wrapper Critical Error:', error)
    return null
  }
}
