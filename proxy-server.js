// Simple CORS proxy for Foundry Local
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const FOUNDRY_ENDPOINT = 'http://127.0.0.1:5273';

// MIME types for static files
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
    // Set CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    
    // Proxy requests to /api/* to Foundry Local
    if (req.url.startsWith('/api/')) {
        const targetPath = req.url.replace('/api', '/v1');
        const targetUrl = `${FOUNDRY_ENDPOINT}${targetPath}`;
        
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const options = {
                method: req.method,
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            
            const proxyReq = http.request(targetUrl, options, (proxyRes) => {
                res.writeHead(proxyRes.statusCode, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                proxyRes.pipe(res);
            });
            
            proxyReq.on('error', (err) => {
                console.error('Proxy error:', err.message);
                res.writeHead(502);
                res.end(JSON.stringify({ error: 'Proxy error: ' + err.message }));
            });
            
            if (body) {
                proxyReq.write(body);
            }
            proxyReq.end();
        });
        return;
    }
    
    // Serve static files
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);
    
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Chess server running at http://localhost:${PORT}`);
    console.log(`📡 Proxying /api/* to Foundry Local at ${FOUNDRY_ENDPOINT}`);
});
