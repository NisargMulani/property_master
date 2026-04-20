const fs   = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log file path (one file per day)
function getLogFile() {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return path.join(logsDir, `${date}.log`);
}

// ANSI colour helpers (console only)
const c = {
  reset:  '\x1b[0m',
  dim:    '\x1b[2m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  cyan:   '\x1b[36m',
  white:  '\x1b[37m',
  bold:   '\x1b[1m',
};

function statusColor(status) {
  if (status >= 500) return c.red;
  if (status >= 400) return c.yellow;
  if (status >= 300) return c.cyan;
  return c.green;
}

function methodColor(method) {
  const map = { GET: c.green, POST: c.cyan, PUT: c.yellow, PATCH: c.yellow, DELETE: c.red };
  return map[method] || c.white;
}

// Get real client IP (handles proxies / Ngrok / etc.)
function getIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

// Logger middleware
function requestLogger(req, res, next) {
  const startAt  = Date.now();
  const ip       = getIP(req);
  const method   = req.method;
  const url      = req.originalUrl || req.url;

  res.on('finish', () => {
    const duration = Date.now() - startAt;
    const status   = res.statusCode;

    // ISO timestamp
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').replace('Z', '');

    console.log(
      `${c.dim}[${timestamp}]${c.reset} ` +
      `${c.bold}${methodColor(method)}${method.padEnd(6)}${c.reset} ` +
      `${statusColor(status)}${status}${c.reset} ` +
      `${c.white}${url}${c.reset} ` +
      `${c.dim}· ${ip} · ${duration}ms${c.reset}`
    );

    const line =
      `[${timestamp}] ${method.padEnd(6)} ${status} ${url} | IP: ${ip} | ${duration}ms\n`;

    fs.appendFile(getLogFile(), line, (err) => {
      if (err) console.error('Logger write error:', err.message);
    });
  });

  next();
}

module.exports = requestLogger;
