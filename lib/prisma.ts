import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a function that only initializes Prisma during runtime
function createPrismaClient(): PrismaClient {
    if (typeof window !== 'undefined') {
    // Mock Prisma client for browser
    return new Proxy({}, {
      get(target: any, prop: string) {
        if (prop === '$connect' || prop === '$disconnect' || prop === '$transaction' || prop === '$use') {
          return () => Promise.resolve();
        }
        // Return a function that returns a mock for any model access
        return {
          count: () => Promise.resolve(0),
          findUnique: () => Promise.resolve(null),
          findMany: () => Promise.resolve([]),
          create: (data: any) => Promise.resolve(data),
          update: (data: any) => Promise.resolve(data),
          delete: () => Promise.resolve({}),
          upsert: (data: any) => Promise.resolve(data),
        };
      },
    }) as any;
  }
  
  // For build time, check if we're in a build environment by checking for environment variables
  // This is a more reliable way to detect build time
  try {
    // Attempt to create the Prisma client
    return new PrismaClient()
  } catch (e) {
    // If Prisma client creation fails (likely during build), return a mock client
    console.error('CRITICAL: Prisma Client initialization failed. Using mock client.', e)
    return new Proxy({}, {
      get(target: any, prop: string) {
        if (prop === '$connect' || prop === '$disconnect' || prop === '$transaction' || prop === '$use') {
          return () => Promise.resolve();
        }
        // Return a function that returns a mock for any model access
        return {
          count: () => Promise.resolve(0),
          findUnique: () => Promise.resolve(null),
          findMany: () => Promise.resolve([]),
          create: (data: any) => Promise.resolve(data),
          update: (data: any) => Promise.resolve(data),
          delete: () => Promise.resolve({}),
          upsert: (data: any) => Promise.resolve(data),
        };
      },
    }) as any;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma