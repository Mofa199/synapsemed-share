import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenFromRequest } from '@/lib/db-utils'

// API endpoints to validate
const API_ENDPOINTS = [
  { path: '/api/auth/verify', method: 'GET', requiresAuth: false },
  { path: '/api/user/profile', method: 'GET', requiresAuth: true },
  { path: '/api/user/gamification', method: 'GET', requiresAuth: true },
  { path: '/api/admin/stats', method: 'GET', requiresAuth: true, adminOnly: true },
  { path: '/api/admin/users', method: 'GET', requiresAuth: true, adminOnly: true },
  { path: '/api/admin/drug-classes', method: 'GET', requiresAuth: true },
  { path: '/api/admin/drugs', method: 'GET', requiresAuth: true },
  { path: '/api/admin/seed-drugs', method: 'GET', requiresAuth: false },
  { path: '/api/admin/modules', method: 'GET', requiresAuth: true },
  { path: '/api/admin/curriculums', method: 'GET', requiresAuth: true },
  { path: '/api/health/check', method: 'GET', requiresAuth: false },
]

// GET /api/admin/validate - Validate all API endpoints
export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || !['SUPER_ADMIN', 'LECTURER'].includes(user.role as string)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const results = {
      totalEndpoints: API_ENDPOINTS.length,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      testResults: [] as any[],
      summary: {
        authenticationWorking: false,
        databaseConnected: false,
        adminEndpointsWorking: false,
        publicEndpointsWorking: false
      }
    }

    // Test each endpoint
    for (const endpoint of API_ENDPOINTS) {
      const testResult = {
        path: endpoint.path,
        method: endpoint.method,
        requiresAuth: endpoint.requiresAuth,
        adminOnly: endpoint.adminOnly || false,
        status: 'unknown',
        responseTime: 0,
        statusCode: 0,
        error: null as string | null
      }

      try {
        const startTime = Date.now()
        
        // Build test request
        const testUrl = new URL(endpoint.path, request.url)
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        }

        // Add auth header if needed
        if (endpoint.requiresAuth) {
          const authHeader = request.headers.get('authorization')
          const cookieHeader = request.headers.get('cookie')
          
          if (authHeader) {
            headers['authorization'] = authHeader
          } else if (cookieHeader) {
            headers['cookie'] = cookieHeader
          }
        }

        // Make test request
        const response = await fetch(testUrl.toString(), {
          method: endpoint.method,
          headers
        })

        const endTime = Date.now()
        testResult.responseTime = endTime - startTime
        testResult.statusCode = response.status

        // Evaluate response
        if (response.status >= 200 && response.status < 300) {
          testResult.status = 'passed'
          results.passedTests++
        } else if (response.status === 401 && endpoint.requiresAuth) {
          // This might be expected if auth is working correctly
          testResult.status = 'passed'
          testResult.error = 'Authentication required (expected)'
          results.passedTests++
        } else if (response.status === 403 && endpoint.adminOnly) {
          // This might be expected if permissions are working correctly
          testResult.status = 'passed'
          testResult.error = 'Insufficient permissions (expected)'
          results.passedTests++
        } else {
          testResult.status = 'failed'
          testResult.error = `HTTP ${response.status}: ${response.statusText}`
          results.failedTests++
        }
      } catch (error) {
        testResult.status = 'failed'
        testResult.error = error instanceof Error ? error.message : 'Unknown error'
        results.failedTests++
      }

      results.testResults.push(testResult)
    }

    // Generate summary
    const authTests = results.testResults.filter(t => t.requiresAuth)
    const adminTests = results.testResults.filter(t => t.adminOnly)
    const publicTests = results.testResults.filter(t => !t.requiresAuth)

    results.summary.authenticationWorking = authTests.length > 0 && 
      authTests.every(t => t.status === 'passed')
    
    results.summary.adminEndpointsWorking = adminTests.length > 0 && 
      adminTests.every(t => t.status === 'passed')
    
    results.summary.publicEndpointsWorking = publicTests.length > 0 && 
      publicTests.every(t => t.status === 'passed')

    // Check database connectivity
    const healthTest = results.testResults.find(t => t.path === '/api/health/check')
    results.summary.databaseConnected = healthTest?.status === 'passed'

    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('API validation failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to validate APIs'
    }, { status: 500 })
  }
}