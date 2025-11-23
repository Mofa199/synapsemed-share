#!/bin/bash

# Post-Deployment Script for SynapseMed
# Run this script after deploying the application to set up the database

echo "Starting post-deployment setup..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

echo "Installing dependencies..."
npm install --legacy-peer-deps

echo "Generating Prisma client..."
npx prisma generate

echo "Running database migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx prisma db seed

echo "Building application..."
npm run build

echo "Post-deployment setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Start the application with: pm2 start npm --name 'synapsemed' -- run start"
echo "2. Check the application status with: pm2 status"
echo "3. View logs with: pm2 logs synapsemed"