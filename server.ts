import http from "http"
import https from "https"
import fs from "fs"
import next from "next"
import { parse, UrlWithParsedQuery } from "url"
import { IncomingMessage, ServerResponse } from "http"
import { createAdminUser } from "./create-admin"

// Application hostname - use environment variable or default to localhost
const hostname = process.env.HOSTNAME || 'localhost'

// Server port - use environment variable or default to 3000
const port = Number(process.env.PORT) || 3000

// Development mode flag
const dev = process.env.NODE_ENV !== 'production'

// Protocol based on environment
const protocol = dev ? 'http' : 'https'

// SSL Configuration
const loadSSLOptions = (): https.ServerOptions => {
  if (dev) {
    console.log('🔧 Running in development mode - using HTTP')
    return {}
  }

  const sslKeyPath = process.env.SSL_KEY_PATH
  const sslCertPath = process.env.SSL_CERT_PATH

  if (!sslKeyPath || !sslCertPath) {
    throw new Error(
      '❌ SSL certificate paths are required in production. ' +
      'Please set SSL_KEY_PATH and SSL_CERT_PATH environment variables.'
    )
  }

  if (!fs.existsSync(sslKeyPath) || !fs.existsSync(sslCertPath)) {
    throw new Error(
      `❌ SSL files not found. Key: ${sslKeyPath}, Cert: ${sslCertPath}`
    )
  }

  console.log('🔒 Loading SSL certificates for HTTPS server')
  return {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath),
  }
}

// Initialize Next.js application with configuration
const app = next({ dev, hostname, port })

// Request handler for Next.js pages and API routes
const handle = app.getRequestHandler()

// Request Handler
const requestHandler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  try {
    // Parse URL with query string support (true flag parses query portion)
    const parsedUrl: UrlWithParsedQuery = parse(req.url || '/', true)
    const { pathname, query } = parsedUrl

    // Custom routing - add your specific routes here
    // This allows you to map specific paths to Next.js pages
    if (pathname === '/a') {
      await app.render(req, res, '/a', query)
    } else if (pathname === '/b') {
      await app.render(req, res, '/b', query)
    } else {
      await handle(req, res, parsedUrl)
    }

  } catch (error) {
    console.error('🚨 Error occurred handling request:', req.url, error)

    // Only set status if headers haven't been sent yet
    if (!res.headersSent) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        error: 'Internal Server Error',
        message: dev ? (error as Error).message : 'Something went wrong'
      }))
    }
  }
}

// Server Initialization
const startServer = async (): Promise<void> => {
  try {

    // Prepare Next.js application (builds pages, sets up routes)
    await app.prepare()
    console.log('✅ Next.js application prepared successfully')

    // Create HTTP/HTTPS server
    if (dev) {
      // Start listening on specified port and hostname
      http.createServer(requestHandler).listen(port, hostname, () => {
        console.log(`🚀 Server running at ${protocol}://${hostname}:${port}`)
        console.log(`📁 Environment: ${dev ? 'development' : 'production'}`)
      })
    } else {
      https.createServer(loadSSLOptions(), requestHandler).listen(port, hostname, () => {
        console.log(`🚀 Server running at ${protocol}://${hostname}:${port}`)
        console.log(`📁 Environment: ${dev ? 'development' : 'production'}`)
      })
    }

    createAdminUser()

  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Start the Server
startServer().catch((error) => {
  console.error('💥 Critical failure during server initialization:', error)
  process.exit(1)
})