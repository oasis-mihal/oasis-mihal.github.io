const express = require('express');
const path = require('path');
//const http = require('http');
const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

const app = express();
//const server = http.createServer(app);
const server = https.createServer({
  pfx: fs.readFileSync('E:/Documents/GodotProjects/localhost.pfx'),
  passphrase: 'password' // match what you used in PowerShell
}, app);

const wss = new WebSocket.Server({ server });

const sessions = new Map();

app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', (ws) => {
  let sessionId = null, role = null;

  ws.on('message', (msg) => {
    let data;
    try { data = JSON.parse(msg); } catch { return; }

    if (data.relay_type === 'join') {
      sessionId = data.session;
      role = data.role;
      if (!sessions.has(sessionId)) sessions.set(sessionId, {});
      sessions.get(sessionId)[role] = ws;
      console.log(`Joined: session=${sessionId} role=${role}`);
    }
    if (data.relay_type === 'forward') {
      const peerRole = role === 'pc' ? 'phone' : 'pc';
      const peer = sessions.get(sessionId)?.[peerRole];
      if (peer && peer.readyState === WebSocket.OPEN) {
        peer.send(JSON.stringify(data));
      }
    }
  });

  ws.on('close', () => {
    if (sessionId && sessions.has(sessionId)) {
      sessions.get(sessionId)[role] = null;
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));