# Environment Variables Guide

This document explains the environment variables used in the Synapse Med project and what might be missing for full functionality.

## Current Environment Variables

Your project currently has the following environment variables configured:

### Database (Neon PostgreSQL)
- `DATABASE_URL` - Main database connection string
- `POSTGRES_URL` - PostgreSQL connection URL
- `POSTGRES_PRISMA_URL` - Prisma-specific connection URL
- `DATABASE_URL_UNPOOLED` - Non-pooled database connection
- `POSTGRES_URL_NON_POOLING` - Non-pooling PostgreSQL URL
- `POSTGRES_URL_NO_SSL` - PostgreSQL URL without SSL
- `PGHOST` / `PGHOST_UNPOOLED` - PostgreSQL host
- `POSTGRES_HOST` - PostgreSQL host
- `POSTGRES_USER` / `PGUSER` - Database user
- `POSTGRES_PASSWORD` / `PGPASSWORD` - Database password
- `POSTGRES_DATABASE` / `PGDATABASE` - Database name
- `NEON_PROJECT_ID` - Neon project identifier

### AI Services
- `OPENAI_API_KEY` - OpenAI API key (currently configured)
- `DEEPSEEK_API_KEY` - DeepSeek API key for AI chat functionality

### Authentication & Security
- `JWT_SECRET` - JSON Web Token secret for authentication
- `STACK_SECRET_SERVER_KEY` - Stack Auth server key
- `NEXT_PUBLIC_STACK_PROJECT_ID` - Stack Auth project ID (public)
- `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` - Stack Auth client key (public)

## Potentially Missing Environment Variables

Based on the application features, you might need these additional variables:

### File Upload & Storage
\`\`\`env
# For file uploads (images, PDFs, etc.)
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Or if using Vercel Blob
BLOB_READ_WRITE_TOKEN=your_blob_token
\`\`\`

### Email Services (for notifications, password reset)
\`\`\`env
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASSWORD=your_email_password

# Or using a service like Resend
RESEND_API_KEY=your_resend_api_key
\`\`\`

### Additional AI Services (optional)
\`\`\`env
# If you want to use multiple AI providers
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_AI_API_KEY=your_google_ai_key
\`\`\`

### Analytics & Monitoring (optional)
\`\`\`env
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
SENTRY_DSN=your_sentry_dsn
\`\`\`

### Social Authentication (if needed)
\`\`\`env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
\`\`\`

## How to Add Missing Variables

1. **In Development (.env.local)**:
   Create a `.env.local` file in your project root and add the missing variables.

2. **In Production (Vercel)**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add the required variables

## Current Status

✅ **Working**: Database, AI Chat, Authentication
⚠️ **May Need Setup**: File uploads, Email services
❓ **Optional**: Analytics, Social auth, Additional AI providers

## Next Steps

1. **File Uploads**: Set up UploadThing or Vercel Blob for handling image and PDF uploads
2. **Email**: Configure SMTP or email service for user notifications
3. **Test**: Verify all features work with current environment variables

The application should work with the current environment variables, but file uploads and email features may need additional configuration.
