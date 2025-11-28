# SynapseMed Deployment Instructions

This guide will help you deploy the SynapseMed application to your server using DirectAdmin.

## Prerequisites

1. Server with DirectAdmin control panel
2. Node.js installed (version 18 or higher)
3. PostgreSQL database access
4. Domain name configured
5. SMTP credentials for email functionality

## Step 1: Prepare Your Server

### 1.1 Install Node.js
If Node.js is not already installed on your server:

```bash
# Check if Node.js is installed
node --version
npm --version

# If not installed, install Node.js (example for CentOS/RHEL)
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Or for Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 1.2 Install PM2 (Process Manager)
```bash
npm install -g pm2
```

## Step 2: Upload Application Files

### 2.1 Using DirectAdmin File Manager
1. Log in to your DirectAdmin control panel
2. Navigate to "File Manager"
3. Upload the SynapseMed application files to your desired directory (e.g., `/home/username/synapsemed`)

### 2.2 Using SFTP/SCP
```bash
# From your local machine, upload files to server
scp -r /path/to/local/synapsemed username@yourserver.com:/home/username/synapsemed
```

## Step 3: Configure Environment Variables

Create a `.env` file in the root directory of your application:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/synapsemed_db?sslmode=prefer"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-min-32-characters"
NEXTAUTH_URL="https://yourdomain.com"

# SMTP Configuration for Email
SMTP_HOST="your-smtp-host.com"
SMTP_PORT="587"
SMTP_USER="info@synapsemed.co.tz"
SMTP_PASSWORD="your-smtp-password"

# AI Backend (if using)
AI_BACKEND_URL="https://ai.synapsemed.co.tz"

# Other configurations as needed
```

## Step 4: Install Dependencies

Navigate to your application directory and install dependencies:

```bash
cd /home/username/synapsemed
npm install --legacy-peer-deps
```

## Step 5: Database Setup

### 5.1 Create Database
Using DirectAdmin:
1. Go to "MySQL Management"
2. Create a new database
3. Create a database user and assign privileges

### 5.2 Run Database Migrations
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database with initial data
npx prisma db seed
```

## Step 6: Build the Application

```bash
# Build the Next.js application
npm run build
```

## Step 7: Configure DirectAdmin for Node.js Application

### 7.1 Create Custom Application in DirectAdmin
1. Log in to DirectAdmin
2. Go to "Custom HTTPD Configurations"
3. Select your domain
4. Add the following configuration:

```
# Proxy requests to Next.js application
ProxyPass / http://localhost:3000/
ProxyPassReverse / http://localhost:3000/
```

### 7.2 Alternative: Using Node.js Selector (if available)
1. Go to "Node.js Selector" in DirectAdmin
2. Enable Node.js for your domain
3. Set the application root path
4. Set the startup file to your application entry point

## Step 8: Start the Application

### 8.1 Using PM2 (Recommended)
```bash
# Start the application with PM2
pm2 start npm --name "synapsemed" -- run start

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### 8.2 Using DirectAdmin Process Monitor
If DirectAdmin has a process monitor:
1. Create a new process
2. Set command to: `npm run start`
3. Set working directory to your application path

## Step 9: Configure Email Functionality

### 9.1 SMTP Configuration
Ensure your `.env` file has the correct SMTP settings:
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=info@synapsemed.co.tz
SMTP_PASSWORD=your-app-password
```

### 9.2 Staff Mail Link
The staff mail link in the footer points to:
```
https://mail.synapsemed.co.tz
```

Make sure this subdomain is configured in your DNS settings to point to your Roundcube installation.

## Step 10: Configure SSL Certificate

### 10.1 Using Let's Encrypt (via DirectAdmin)
1. Go to "SSL Certificates" in DirectAdmin
2. Select "Let's Encrypt"
3. Choose your domain
4. Request certificate

### 10.2 Manual SSL Configuration
If using custom SSL certificates:
1. Upload certificate files via DirectAdmin
2. Configure SSL in your domain settings

## Step 11: Final Configuration

### 11.1 Update Email Subscription Model
After deployment, run the database migration to add the email subscription model:

```bash
npx prisma migrate dev --name add_email_subscription_model
```

### 11.2 Verify Application
1. Visit your domain in a browser
2. Test user registration and login
3. Test email subscription functionality
4. Test staff mail link

## Troubleshooting

### Common Issues

1. **Application not starting**
   - Check PM2 logs: `pm2 logs synapsemed`
   - Verify environment variables
   - Check port conflicts

2. **Database connection issues**
   - Verify DATABASE_URL in .env
   - Check database credentials
   - Ensure database server is running

3. **Email not sending**
   - Verify SMTP credentials
   - Check firewall settings
   - Test SMTP connection separately

4. **SSL/HTTPS issues**
   - Verify certificate installation
   - Check domain configuration
   - Ensure proxy settings are correct

### Useful Commands

```bash
# Check application status
pm2 status

# View application logs
pm2 logs synapsemed

# Restart application
pm2 restart synapsemed

# Stop application
pm2 stop synapsemed

# Check Node.js version
node --version

# Check npm version
npm --version
```

## Maintenance

### Regular Tasks
1. **Backup database regularly**
2. **Monitor application logs**
3. **Update dependencies periodically**
4. **Renew SSL certificates**

### Updating the Application
1. Upload new files to server
2. Install/update dependencies: `npm install --legacy-peer-deps`
3. Run database migrations if needed: `npx prisma migrate deploy`
4. Rebuild application: `npm run build`
5. Restart application: `pm2 restart synapsemed`

## Support

For additional support:
- Check the application logs
- Refer to Next.js documentation
- Contact your hosting provider for server-specific issues