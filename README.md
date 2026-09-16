# Jungle Clash

A browser-based 2D fighting game with mobile touch controls, CPU difficulty modes, sound effects, and two-player Wi-Fi rooms.

## Local deployment

Requirements: Node.js 18 or newer.

```powershell
npm install
npm start
```

Open `http://localhost:8000/` in a browser. The server serves the game at `/` and exposes `/health` for deployment checks.

## Two phones on Wi-Fi

1. Start the server on a computer connected to the same Wi-Fi as both phones.
2. Find the computer's local IPv4 address.
3. Open `http://COMPUTER_IP:8000/` on both phones.
4. Use the same room code. One player chooses **Host Wi-Fi Room** and the other chooses **Join Room**.

The Node server must remain running while the phones play. A public deployment needs a host that supports long-lived WebSocket connections.

## Production deployment

This project can be deployed as a Node web service. Use:

- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`

Do not deploy `node_modules`; the platform installs dependencies from `package-lock.json`.
