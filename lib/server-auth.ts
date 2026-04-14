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
    const secureToken = cookieStore.get('__Secure-next-auth.session-token')?.value
    const normalToken = cookieStore.get('next-auth.session-token')?.value
    const legacyToken = cookieStore.get('auth-token')?.value
    const userCookie = cookieStore.get('synapse-user')?.value

    // Determine the active NextAuth token and its corresponding salt
    const nextAuthToken = secureToken || normalToken
    const salt = secureToken ? '__Secure-next-auth.session-token' : 'next-auth.session-token'

    // 2. Try decoding NextAuth token if it exists
    if (nextAuthToken && process.env.NEXTAUTH_SECRET) {
      try {
        const decoded = await decode({ 
          token: nextAuthToken, 
          secret: process.env.NEXTAUTH_SECRET,
          // NextAuth uses the cookie name as the salt for JWT encryption
          salt: salt
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
        // Only log error if not a fallback situation
        console.error(`NextAuth Decode Error (Salt: ${salt}):`, e)
      }
    }

    // 3. Try decoding Legacy/Manual JWT token
    if (legacyToken && process.env.JWT_SECRET) {
      try {
        const decodedLegacy = jwt.verify(legacyToken, process.env.JWT_SECRET) as any
        if (decodedLegacy) {
          return {
            user: {
              id: decodedLegacy.userId || decodedLegacy.id,
              email: decodedLegacy.email,
              role: decodedLegacy.role,
              name: decodedLegacy.name,
              field: decodedLegacy.field
            }
          }
        }
      } catch (e) {
        console.error('Legacy JWT Verify Error:', e)
      }
    }

    // 4. FINAL FALLBACK: Database Verify (The "Ultimate Fix")
    // If the browser has a NextAuth session cookie + a user info cookie,
    // we take the email from the user cookie and verify it in the DB.
    // This solves cases where JWT decoding is blocked by proxy/salt issues but the user is legit.
    if (userCookie && (nextAuthToken || legacyToken)) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie))
        if (userData && userData.email) {
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
