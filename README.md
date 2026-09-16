# Jungle Clash

A browser-based 2D fighting game with mobile touch controls, CPU difficulty modes, sound effects, and two-player Wi-Fi rooms.

## Local deployment

Requirements: Node.js 18 or newer.

```powershell
npm install
npm start
```

Open `http://localhost:8000/` in a browser. The server serves `index.html` at `/` and exposes `/health` for deployment checks.

## Two phones on Wi-Fi

1. Start the server on a computer connected to the same Wi-Fi as both phones.
2. Find the computer's local IPv4 address.
3. Open `http://COMPUTER_IP:8000/` on both phones.
4. Use the same room code. One player chooses **Host Wi-Fi Room** and the other chooses **Join Room**.

The Node server must remain running while the phones play. A public deployment needs a host that supports long-lived WebSocket connections.

## Vercel deployment

The game is available at the Vercel root URL because the entry page is named `index.html`. CPU mode, mobile controls, sound effects, and the single-device game work on Vercel.

Vercel does not keep the `ws` WebSocket server alive for real-time rooms. For two-phone Wi-Fi multiplayer, run the Node server on a WebSocket-capable host or on a computer on the same Wi-Fi network.

## Node production deployment

This project can be deployed as a Node web service. Use:

- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`

Do not deploy `node_modules`; the platform installs dependencies from `package-lock.json`.
