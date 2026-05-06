# Localhost URL

## Development Server

The Next.js development server runs on:

**http://localhost:3000**

## Starting the Server

To start the development server, run:

```bash
npm run dev
```

Or:

```bash
yarn dev
```

Or:

```bash
pnpm dev
```

## Access the Application

Once the server is running, open your browser and navigate to:

**http://localhost:3000**

## Default Port

If port 3000 is already in use, Next.js will automatically use the next available port (3001, 3002, etc.) and display it in the terminal.

## Features Available

- **Home/Landing Page**: Premium animated landing page
- **Calculator**: Full-featured scientific calculator with Casio-style UI
- **Problem Solver**: JEE Advanced problem solver with step-by-step solutions
- **History**: Persistent calculation history sidebar
- **Footer**: Contact information and copyright

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed:
   ```bash
   npm install
   ```

2. Check for port conflicts:
   ```bash
   lsof -i :3000
   ```

3. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```
