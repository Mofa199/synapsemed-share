import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt'
import jwt from 'jsonwebtoken'

// Custom getServerSession wrapper to bypass strict Host/Proxy checks in NextAuth 4
// and add compatibility with Next.js 15 async cookies.
export async function getServerSession(authOptions?: any) {
  try {
    // Next.js 15 compatibility for cookies()
    const cookieStore = await cookies()
    
    // Check NextAuth tokens first
    const nextAuthToken = cookieStore.get('next-auth.session-token')?.value || 
                          cookieStore.get('__Secure-next-auth.session-token')?.value
    
    if (nextAuthToken && process.env.NEXTAUTH_SECRET) {
      const decoded = await decode({ token: nextAuthToken, secret: process.env.NEXTAUTH_SECRET })
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
    }

    // Fallback: check manual auth-token (legacy/current manual login endpoint)
    const legacyToken = cookieStore.get('auth-token')?.value
    if (legacyToken && process.env.JWT_SECRET) {
      const decodedLegacy = jwt.verify(legacyToken, process.env.JWT_SECRET) as any
      if (decodedLegacy) {
        return {
          user: {
            id: decodedLegacy.userId,
            email: decodedLegacy.email,
            role: decodedLegacy.role,
            name: undefined, // might not be in token
            field: undefined // might not be in token
          }
        }
      }
    }

    return null
  } catch (error) {
    console.error('getServersession Wrapper Error:', error)
    return null
  }
}
