"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Server,
  Database,
  Shield,
  Globe,
  Activity,
  Zap
} from "lucide-react"

interface TestResult {
  path: string
  method: string
  requiresAuth: boolean
  adminOnly: boolean
  status: 'passed' | 'failed' | 'unknown'
  responseTime: number
  statusCode: number
  error: string | null
}

interface ValidationResults {
  totalEndpoints: number
  passedTests: number
  failedTests: number
  skippedTests: number
  testResults: TestResult[]
  summary: {
    authenticationWorking: boolean
    databaseConnected: boolean
    adminEndpointsWorking: boolean
    publicEndpointsWorking: boolean
  }
}

interface HealthStatus {
  status: string
  timestamp: string
  services: {
    database: string
    auth: string
    storage: string
  }
  errors: string[]
}

export default function SystemValidationPage() {
  const { toast } = useToast()
  const [validationResults, setValidationResults] = useState<ValidationResults | null>(null)
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isCheckingHealth, setIsCheckingHealth] = useState(false)

  useEffect(() => {
    checkSystemHealth()
  }, [])

  const checkSystemHealth = async () => {
    setIsCheckingHealth(true)
    try {
      const response = await fetch('/api/health/check')
      const data = await response.json()
      setHealthStatus(data)
    } catch (error) {
      console.error('Health check failed:', error)
      toast({
        title: "Health Check Failed",
        description: "Unable to check system health",
        variant: "destructive",
      })
    } finally {
      setIsCheckingHealth(false)
    }
  }

  const runValidation = async () => {
    setIsValidating(true)
    try {
      const response = await fetch('/api/admin/validate')
      if (response.ok) {
        const result = await response.json()
        setValidationResults(result.data)

        if (result.data.failedTests === 0) {
          toast({
            title: "Validation Complete",
            description: "All API endpoints are working correctly",
          })
        } else {
          toast({
            title: "Validation Complete",
            description: `${result.data.failedTests} tests failed`,
            variant: "destructive",
          })
        }
      } else {
        throw new Error('Validation request failed')
      }
    } catch (error) {
      console.error('Validation failed:', error)
      toast({
        title: "Validation Failed",
        description: "Unable to validate API endpoints",
        variant: "destructive",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
      case 'healthy':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'failed':
      case 'unhealthy':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'degraded':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getResponseTimeColor = (time: number) => {
    if (time < 200) return 'text-green-600'
    if (time < 500) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#213874] mb-2">System Validation</h1>
              <p className="text-gray-600">Monitor API health and validate system functionality</p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={checkSystemHealth}
                disabled={isCheckingHealth}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                {isCheckingHealth ? 'Checking...' : 'Health Check'}
              </Button>

              <Button
                onClick={runValidation}
                disabled={isValidating}
                className="bg-[#213874] hover:bg-[#1a6ac3] flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isValidating ? 'animate-spin' : ''}`} />
                {isValidating ? 'Validating...' : 'Run Validation'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* System Health */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                {healthStatus ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Status</span>
                      <Badge className={getStatusColor(healthStatus.status)}>
                        {getStatusIcon(healthStatus.status)}
                        <span className="ml-1">{healthStatus.status}</span>
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Database</span>
                        </div>
                        <Badge className={getStatusColor(healthStatus.services.database)}>
                          {getStatusIcon(healthStatus.services.database)}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Authentication</span>
                        </div>
                        <Badge className={getStatusColor(healthStatus.services.auth)}>
                          {getStatusIcon(healthStatus.services.auth)}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">Storage</span>
                        </div>
                        <Badge className={getStatusColor(healthStatus.services.storage)}>
                          {getStatusIcon(healthStatus.services.storage)}
                        </Badge>
                      </div>
                    </div>

                    {healthStatus.errors.length > 0 && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="text-sm font-semibold text-red-800 mb-2">Issues Found:</h4>
                        <ul className="text-xs text-red-700 space-y-1">
                          {healthStatus.errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 pt-2 border-t">
                      Last checked: {new Date(healthStatus.timestamp).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Server className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">Click "Health Check" to check system status</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Validation Summary */}
            {validationResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Validation Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#213874] mb-1">
                        {validationResults.passedTests}/{validationResults.totalEndpoints}
                      </div>
                      <div className="text-sm text-gray-600">Tests Passed</div>
                      <Progress
                        value={(validationResults.passedTests / validationResults.totalEndpoints) * 100}
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-semibold text-green-700">
                          {validationResults.passedTests}
                        </div>
                        <div className="text-xs text-green-600">Passed</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-lg font-semibold text-red-700">
                          {validationResults.failedTests}
                        </div>
                        <div className="text-xs text-red-600">Failed</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Authentication</span>
                        <Badge className={validationResults.summary.authenticationWorking ?
                          'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {validationResults.summary.authenticationWorking ? 'Working' : 'Issues'}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Database</span>
                        <Badge className={validationResults.summary.databaseConnected ?
                          'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {validationResults.summary.databaseConnected ? 'Connected' : 'Disconnected'}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Admin APIs</span>
                        <Badge className={validationResults.summary.adminEndpointsWorking ?
                          'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {validationResults.summary.adminEndpointsWorking ? 'Working' : 'Issues'}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Public APIs</span>
                        <Badge className={validationResults.summary.publicEndpointsWorking ?
                          'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {validationResults.summary.publicEndpointsWorking ? 'Working' : 'Issues'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Test Results */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  API Endpoint Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {validationResults ? (
                  <div className="space-y-3">
                    {validationResults.testResults.map((test, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border transition-all duration-200 ${
                          test.status === 'passed'
                            ? 'border-green-200 bg-green-50'
                            : test.status === 'failed'
                            ? 'border-red-200 bg-red-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusIcon(test.status)}
                              <span className="font-medium text-gray-900">
                                {test.method} {test.path}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {test.statusCode}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className={`font-medium ${getResponseTimeColor(test.responseTime)}`}>
                                {test.responseTime}ms
                              </span>

                              {test.requiresAuth && (
                                <Badge variant="outline" className="text-xs">
                                  Auth Required
                                </Badge>
                              )}

                              {test.adminOnly && (
                                <Badge variant="outline" className="text-xs">
                                  Admin Only
                                </Badge>
                              )}
                            </div>

                            {test.error && (
                              <div className="mt-2 text-sm text-red-600">
                                {test.error}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No validation results</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Click "Run Validation" to test all API endpoints
                    </p>
                    <Button
                      onClick={runValidation}
                      disabled={isValidating}
                      className="bg-[#213874] hover:bg-[#1a6ac3]"
                    >
                      Start Validation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}