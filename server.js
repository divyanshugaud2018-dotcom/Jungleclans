const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const root = __dirname;
const port = Number(process.env.PORT || 8000);
const rooms = new Map();

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const requested = decodeURIComponent((req.url || '/').split('?')[0]);
  const fileName = requested === '/' ? 'jungle-clash (1).html' : requested.replace(/^\/+/, '');
  const filePath = path.resolve(root, fileName);
  if (!filePath.startsWith(root) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end('Not found');
    return;
  }
  res.writeHead(200, {'Content-Type': mime[path.extname(filePath)] || 'application/octet-stream'});
  fs.createReadStream(filePath).pipe(res);
});

const wss = new WebSocket.Server({server});
wss.on('connection', socket => {
  let roomCode = null;
  let role = null;

  socket.on('message', raw => {
    let message;
    try { message = JSON.parse(raw.toString()); } catch { return; }
    if (message.type === 'join') {
      roomCode = String(message.room || '').replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 8);
      role = message.role === 'join' ? 'join' : 'host';
      if (!roomCode) return;
      let room = rooms.get(roomCode);
      if (!room) {
        room = {host: null, join: null};
        rooms.set(roomCode, room);
      }
      if (room[role] && room[role] !== socket) {
        room[role].close();
      }
      room[role] = socket;
      const ready = Boolean(room.host && room.join);
      socket.send(JSON.stringify({type: 'room', ready, message: ready ? 'Opponent connected' : 'Waiting for opponent'}));
      if (ready) {
        [room.host, room.join].forEach(client => client.send(JSON.stringify({type: 'room', ready: true, message: 'Opponent connected'})));
      }
      return;
    }
    if (message.type === 'input' && roomCode && rooms.has(roomCode)) {
      const room = rooms.get(roomCode);
      const opponent = role === 'host' ? room.join : room.host;
      if (opponent && opponent.readyState === WebSocket.OPEN) {
        opponent.send(JSON.stringify({type: 'input', input: message.input || {}}));
      }
    }
    if (message.type === 'fighter' && roomCode && rooms.has(roomCode)) {
      const room = rooms.get(roomCode);
      const opponent = role === 'host' ? room.join : room.host;
      if (opponent && opponent.readyState === WebSocket.OPEN) {
        opponent.send(JSON.stringify({type: 'fighter', slot: message.slot, fid: message.fid}));
      }
    }
  });

  socket.on('close', () => {
    if (!roomCode || !rooms.has(roomCode)) return;
    const room = rooms.get(roomCode);
    if (room[role] === socket) room[role] = null;
    const opponent = role === 'host' ? room.join : room.host;
    if (opponent && opponent.readyState === WebSocket.OPEN) {
      opponent.send(JSON.stringify({type: 'room', ready: false, message: 'Opponent disconnected'}));
    }
    if (!room.host && !room.join) rooms.delete(roomCode);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Jungle Clash server running on http://localhost:${port}`);
  console.log('For phones, open http://YOUR-COMPUTER-IP:' + port + ' on the same Wi-Fi.');
});
