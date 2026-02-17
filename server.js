const http = require('http');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const ROOT_DIR = __dirname;
const MESSAGES_FILE = path.join(ROOT_DIR, 'messages.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.webp': 'image/webp'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': MIME_TYPES['.json'] });
  res.end(JSON.stringify(payload));
}

async function parseJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString('utf-8');
  if (!rawBody) return {};

  return JSON.parse(rawBody);
}

function sanitizePath(urlPath) {
  const safePath = path.normalize(decodeURIComponent(urlPath)).replace(/^([.][.][/\\])+/, '');
  return path.join(ROOT_DIR, safePath);
}

async function saveMessage(message) {
  let existing = [];

  if (fs.existsSync(MESSAGES_FILE)) {
    const fileContent = await fsp.readFile(MESSAGES_FILE, 'utf-8');
    existing = JSON.parse(fileContent || '[]');
  }

  existing.push(message);
  await fsp.writeFile(MESSAGES_FILE, JSON.stringify(existing, null, 2));
}

async function handleApiRoutes(req, res) {
  if (req.method === 'GET' && req.url === '/api/health') {
    return sendJson(res, 200, {
      ok: true,
      service: 'portfolio-backend',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'GET' && req.url === '/api/site-info') {
    return sendJson(res, 200, {
      owner: 'Dhananjay Khaire',
      currentYear: new Date().getFullYear(),
      rights: 'All rights reserved.'
    });
  }

  if (req.method === 'POST' && req.url === '/api/contact') {
    try {
      const body = await parseJsonBody(req);
      const name = String(body.name || '').trim();
      const email = String(body.email || '').trim();
      const message = String(body.message || '').trim();

      if (!name || !email || !message) {
        return sendJson(res, 400, { ok: false, error: 'All fields are required.' });
      }

      const payload = {
        id: Date.now(),
        name,
        email,
        message,
        receivedAt: new Date().toISOString()
      };

      await saveMessage(payload);
      return sendJson(res, 201, { ok: true, message: 'Message received successfully.' });
    } catch (_error) {
      return sendJson(res, 400, { ok: false, error: 'Invalid JSON payload.' });
    }
  }

  return false;
}

async function handleStaticRoutes(req, res) {
  const requestPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = sanitizePath(requestPath);

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  try {
    const stats = await fsp.stat(filePath);
    if (!stats.isFile()) throw new Error('Not a file');

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } catch (_error) {
    if (req.url.startsWith('/api/')) {
      sendJson(res, 404, { ok: false, error: 'API endpoint not found.' });
      return;
    }

    const indexPath = path.join(ROOT_DIR, 'index.html');
    res.writeHead(200, { 'Content-Type': MIME_TYPES['.html'] });
    fs.createReadStream(indexPath).pipe(res);
  }
}

const server = http.createServer(async (req, res) => {
  const handled = await handleApiRoutes(req, res);
  if (handled !== false) return;
  await handleStaticRoutes(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(`Portfolio server running on http://${HOST}:${PORT}`);
});
