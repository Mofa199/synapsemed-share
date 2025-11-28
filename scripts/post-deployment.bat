@echo off
REM Post-Deployment Script for SynapseMed (Windows)
REM Run this script after deploying the application to set up the database

echo Starting post-deployment setup...

REM Check if we're in the correct directory
if not exist "package.json" (
    echo Error: package.json not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

echo Installing dependencies...
npm install --legacy-peer-deps

echo Generating Prisma client...
npx prisma generate

echo Running database migrations...
npx prisma migrate deploy

echo Seeding database...
npx prisma db seed

echo Building application...
npm run build

echo Post-deployment setup completed successfully!
echo.
echo Next steps:
echo 1. Start the application with: pm2 start npm --name "synapsemed" -- run start
echo 2. Check the application status with: pm2 status
echo 3. View logs with: pm2 logs synapsemed

pause