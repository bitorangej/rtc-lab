import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const rooms = new Map(); // roomId -> [ws1, ws2]

function send(ws, payload) {
  if (ws.readyState === 1) {
    ws.send(JSON.stringify(payload));
  }
}

function leaveRoom(ws) {
  const roomId = ws.roomId;
  if (!roomId) return;

  const peers = rooms.get(roomId) || [];
  const remain = peers.filter((p) => p !== ws);

  if (remain.length === 0) {
    rooms.delete(roomId);
  } else {
    rooms.set(roomId, remain);
    remain.forEach((peer) => send(peer, { type: "peer-left" }));
  }

  ws.roomId = null;
  ws.isInitiator = false;
}

wss.on("connection", (ws) => {
  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (msg.type === "join") {
      leaveRoom(ws);

      const roomId = String(msg.roomId || "lab").trim();
      const peers = rooms.get(roomId) || [];

      if (peers.length >= 2) {
        send(ws, { type: "full", roomId });
        return;
      }

      ws.roomId = roomId;
      ws.isInitiator = peers.length === 0;

      peers.push(ws);
      rooms.set(roomId, peers);

      send(ws, {
        type: "joined",
        roomId,
        isInitiator: ws.isInitiator,
      });

      if (peers.length === 2) {
        peers.forEach((peer) => send(peer, { type: "ready" }));
      }

      return;
    }

    if (msg.type === "signal") {
      const peers = rooms.get(ws.roomId) || [];
      peers
        .filter((peer) => peer !== ws)
        .forEach((peer) => send(peer, { type: "signal", data: msg.data }));
      return;
    }
  });

  ws.on("close", () => leaveRoom(ws));
  ws.on("error", () => leaveRoom(ws));
});

const port = 3000;
server.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});
