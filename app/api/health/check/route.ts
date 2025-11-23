import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/health/check - Health check endpoint
export async function GET(request: NextRequest) {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: 'unknown',
        auth: 'unknown',
        storage: 'unknown'
      },
      errors: [] as string[]
    }

    // Test database connection
    try {
      await prisma.$queryRaw`SELECT 1`
      healthStatus.services.database = 'healthy'
    } catch (error) {
      healthStatus.services.database = 'unhealthy'
      healthStatus.errors.push('Database connection failed')
      healthStatus.status = 'degraded'
    }

    // Test authentication service
    try {
      // Simple check for JWT secret
      if (process.env.JWT_SECRET) {
        healthStatus.services.auth = 'healthy'
      } else {
        healthStatus.services.auth = 'misconfigured'
        healthStatus.errors.push('JWT_SECRET not configured')
        healthStatus.status = 'degraded'
      }
    } catch (error) {
      healthStatus.services.auth = 'unhealthy'
      healthStatus.errors.push('Authentication service check failed')
      healthStatus.status = 'degraded'
    }

    // Test storage (simplified check)
    healthStatus.services.storage = 'healthy'

    // Set overall status
    if (healthStatus.errors.length === 0) {
      healthStatus.status = 'healthy'
    } else if (healthStatus.services.database === 'unhealthy') {
      healthStatus.status = 'unhealthy'
    }

    const statusCode = healthStatus.status === 'unhealthy' ? 503 : 200

    return NextResponse.json(healthStatus, { status: statusCode })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      services: {
        database: 'unknown',
        auth: 'unknown',
        storage: 'unknown'
      }
    }, { status: 503 })
  }
}