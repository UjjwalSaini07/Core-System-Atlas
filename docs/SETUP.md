# Setup Guide

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.0.0+ | JavaScript runtime |
| pnpm | 8.0+ (recommended) | Package manager |
| Git | 2.0+ | Version control |

### Optional Software

| Software | Purpose |
|----------|---------|
| VS Code | IDE (recommended) |
| Chrome/Firefox | Browser for testing |
| React DevTools | React debugging |
| Node.js DevTools | Node debugging |


## Installation Steps

### 1. Clone the Repository

```bash
# HTTPS
git clone https://github.com/UjjwalSaini07/Core-System-Atlas.git
```

```bash
# SSH
git clone git@github.com:UjjwalSaini07/Core-System-Atlas.git
```

```bash
# Navigate to project
cd Core-System-Atlas
```

### 2. Install Dependencies

#### Using pnpm (Recommended)
```bash
# Install pnpm if not already installed
npm install -g pnpm
```

```bash
# Install dependencies
pnpm install
```

#### Using npm
```bash
npm install
```

#### Using yarn
```bash
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Application
NEXT_PUBLIC_APP_NAME=Core System Atlas
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API Configuration
API_BASE_URL=http://localhost:3000/api

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_MONITORING=true
```

### 4. Verify Installation

```bash
# Check Node.js version
node --version
```
```bash
# Check pnpm version
pnpm --version
```
```bash
# List installed packages
pnpm list
```


## Development

### Starting the Development Server

```bash
# Using pnpm
pnpm dev
```
```bash
# Using npm
npm run dev
```
```bash
# Using yarn
yarn dev
```

The application will be available at `http://localhost:3000`

### Development Features

- **Hot Module Replacement (HMR)** - Changes reflect instantly
- **Fast Refresh** - React components preserve state
- **Error Overlay** - Shows errors in browser
- **Source Maps** - Easy debugging

### Available Scripts

```bash
# Start development server
pnpm dev
```
```bash
# Build for production
pnpm build
```
```bash
# Start production server
pnpm start
```
```bash
# Lint code
pnpm lint
```
```bash
# Format code
pnpm format
```
```bash
# Type check
pnpm type-check
```
```bash
# Run tests
pnpm test
```

## Production Build

### 1. Build the Application

```bash
pnpm build
```

This creates an optimized production build in the `.next` directory.

### 2. Start Production Server

```bash
pnpm start
```

The server will start on port 3000 by default.

### 3. Environment Variables

Set these for production:

```env
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=Core System Atlas
NEXT_PUBLIC_APP_URL= ---

# Analytics (if enabled)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Security
ALLOWED_HOSTS=www.domain.com
```

## Docker Deployment

### 1. Build Docker Image

```bash
docker build -t core-system-atlas .
```

### 2. Run Container

```bash
# Development
docker run -p 3000:3000 core-system-atlas

# Production
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  core-system-atlas
```

### 3. Docker Compose

The project includes `docker-compose.yml` with:
- Main application container
- Redis for caching (optional)

**Start Services:**
```bash
docker-compose up -d
```

**View Logs:**
```bash
docker-compose logs -f app
```

**Stop Services:**
```bash
docker-compose down
```

**Stop with Volumes:**
```bash
docker-compose down -v
```

### 4. Docker Commands Reference

| Command | Description |
|---------|-------------|
| `docker build -t <name> .` | Build image |
| `docker run -p 3000:3000 <name>` | Run container |
| `docker-compose up -d` | Start services |
| `docker-compose down` | Stop services |
| `docker-compose logs -f` | View logs |
| `docker exec -it <container> sh` | Shell into container |
| `docker ps` | List running containers |
| `docker stop <container>` | Stop container |
| `docker rm <container>` | Remove container |

### 5. Multi-stage Build

The Dockerfile uses multi-stage builds:

1. **deps** - Install dependencies
2. **builder** - Build the Next.js application
3. **runner** - Production-ready image

Benefits:
- Smaller final image
- Better caching
- Security (no build tools in prod)

### 6. Environment Variables

```yaml
services:
  app:
    build: .
    environment:
      - NODE_ENV=production
      - PORT=3000
      - NEXT_TELEMETRY_DISABLED=1
    env_file:
      - .env.production
```

### 7. Health Checks

```yaml
healthcheck:
  test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### 8. Production Deployment

```bash
# Build production image
docker build -t core-system-atlas:prod .

# Tag for registry
docker tag core-system-atlas:prod registry.example.com/core-system-atlas:latest

# Push to registry
docker push registry.example.com/core-system-atlas:latest

# Pull and run on server
docker pull registry.example.com/core-system-atlas:latest
docker run -d -p 3000:3000 --name atlas registry.example.com/core-system-atlas:latest
```

### 9. Docker Best Practices

- Use `.dockerignore` to exclude unnecessary files
- Use specific Node.js version (not `latest`)
- Don't run as root (created `nextjs` user)
- Use multi-stage builds
- Add health checks
- Use named volumes for persistence


## IDE Setup

### VS Code (Recommended)

#### Extensions

Install these VS Code extensions:

1. **ESLint** - Linting
2. **Prettier** - Code formatting
3. **Tailwind CSS IntelliSense** - Tailwind support
4. **React/Redux/React-Native snippets** - Code snippets
5. **GitLens** - Enhanced Git

#### Settings (.vscode/settings.json)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["c\\(([^)]*)\\)", "\"([^\"]*)\""]
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### WebStorm

1. Enable ESLint and Prettier integrations
2. Configure Tailwind CSS
3. Set up JavaScript language version to React JSX


## Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
pnpm dev -- -p 3001
```

#### 2. Node Version Mismatch

```bash
# Check Node version
node --version

# If using nvm, switch versions
nvm use 18

# Or install correct version
nvm install 18
```

#### 3. Dependency Issues

```bash
# Clear node_modules
rm -rf node_modules

# Clear pnpm cache
pnpm store prune

# Reinstall
pnpm install
```

#### 4. TypeScript Errors

```bash
# Run type check
pnpm type-check

# Or with verbose output
pnpm tsc --noEmit --pretty
```

#### 5. Tailwind Not Working

```bash
# Regenerate tailwind config
pnpm exec tailwindcss init

# Or rebuild
pnpm build
```

### Getting Help

1. Check existing [issues](https://github.com/UjjwalSaini07/Core-System-Atlas/issues)
2. Create a new issue with:
   - Node.js version
   - Operating system
   - Error message
   - Steps to reproduce


## Performance Optimization

### Development Tips

1. **Use pnpm** - Faster installs
2. **Enable caching** - ESLint/Tailwind cache
3. **Limit browser tabs** - Reduces HMR overhead

### Production Tips

1. **Static Export** - For pure static sites
2. **Image Optimization** - Use next/image
3. **Code Splitting** - Automatic with Next.js
4. **CDN** - Deploy to Vercel/Netlify


## Next Steps

After setup:

1. Explore the [Dashboard](/)
2. Try the [Visualizations](/visualize)
3. Check [Analytics](/analytics)
4. Read [API Documentation](/docs)
5. Review [Architecture](ARCHITECTURE.md)


## 👨‍💻 Author

Designed and developed with a focus on clean architecture, performance, and developer experience.

<div align="center">

**Ujjwal Saini**  
_Full-Stack Developer_

🌐 [ujjwalsaini.dev](https://www.ujjwalsaini.dev/) · 🐙 [GitHub](https://github.com/UjjwalSaini07)

</div>

<div align="center">
    <a href="#top">
        <img src="https://img.shields.io/badge/Back%20to%20Top-000000?style=for-the-badge&logo=github&logoColor=white" alt="Back to Top">
    </a>
</div>