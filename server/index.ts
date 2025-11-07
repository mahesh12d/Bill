import express, { type Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Start FastAPI server as a child process
const fastapiProcess = spawn('python', ['run_fastapi.py'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  detached: false
});

fastapiProcess.stdout?.on('data', (data) => {
  console.log(`[FastAPI] ${data.toString().trim()}`);
});

fastapiProcess.stderr?.on('data', (data) => {
  console.error(`[FastAPI Error] ${data.toString().trim()}`);
});

fastapiProcess.on('exit', (code) => {
  console.log(`[FastAPI] Process exited with code ${code}`);
});

// Cleanup on exit
process.on('exit', () => {
  fastapiProcess.kill();
});

process.on('SIGINT', () => {
  fastapiProcess.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  fastapiProcess.kill();
  process.exit();
});

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Proxy all /api requests to FastAPI server on port 8000
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
  pathRewrite: {
    '^/': '/api/', // Add back /api prefix that Express strips
  },
  onProxyReq: (proxyReq, req, res) => {
    log(`Proxying ${req.method} ${req.url} to FastAPI`);
  },
  onError: (err, req, res) => {
    console.error(`[Proxy Error] ${err.message}`);
    res.status(502).json({ error: 'Bad Gateway - FastAPI server may not be ready' });
  }
}));

(async () => {
  const http = await import('http');
  const server = http.createServer(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
    log(`API requests proxied to FastAPI on port 8000`);
  });
})();
