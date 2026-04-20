const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// In-memory user registry — never touches the DB
const onlineUsers = new Map();
// { userId: { socketId, userName, ip, subnet } }

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    let registeredUserId = null;

    // Strip IPv6-mapped IPv4 prefix (::ffff:192.168.x.x → 192.168.x.x)
    const rawIp = socket.handshake.address || '127.0.0.1';
    const ip = rawIp.replace(/^::ffff:/, '');
    // Use first 3 octets as subnet key; treat localhost as its own subnet
    const subnet = ip === '127.0.0.1' || ip === '::1' ? 'localhost' : ip.split('.').slice(0, 3).join('.');

    socket.on('register', ({ userId, userName }) => {
      if (!userId || !userName) return;
      registeredUserId = userId;
      onlineUsers.set(userId, { socketId: socket.id, userName, ip, subnet });

      // Send this user the list of others already on the same subnet
      const nearby = [];
      onlineUsers.forEach((user, uid) => {
        if (uid !== userId && user.subnet === subnet) {
          nearby.push({ userId: uid, userName: user.userName });
        }
      });
      socket.emit('nearby-users', nearby);

      // Notify existing users on same subnet about the newcomer
      onlineUsers.forEach((user, uid) => {
        if (uid !== userId && user.subnet === subnet) {
          io.to(user.socketId).emit('user-joined', { userId, userName });
        }
      });
    });

    // ── WebRTC signaling relay ──────────────────────────────────────────
    socket.on('webrtc-offer', ({ targetUserId, offer }) => {
      const target = onlineUsers.get(targetUserId);
      const sender = onlineUsers.get(registeredUserId);
      if (target && sender) {
        io.to(target.socketId).emit('webrtc-offer', {
          fromUserId: registeredUserId,
          fromUserName: sender.userName,
          offer,
        });
      }
    });

    socket.on('webrtc-answer', ({ targetUserId, answer }) => {
      const target = onlineUsers.get(targetUserId);
      if (target) {
        io.to(target.socketId).emit('webrtc-answer', {
          fromUserId: registeredUserId,
          answer,
        });
      }
    });

    socket.on('ice-candidate', ({ targetUserId, candidate }) => {
      const target = onlineUsers.get(targetUserId);
      if (target) {
        io.to(target.socketId).emit('ice-candidate', {
          fromUserId: registeredUserId,
          candidate,
        });
      }
    });

    socket.on('disconnect', () => {
      if (!registeredUserId) return;
      const user = onlineUsers.get(registeredUserId);
      if (user) {
        onlineUsers.forEach((u, uid) => {
          if (uid !== registeredUserId && u.subnet === user.subnet) {
            io.to(u.socketId).emit('user-left', { userId: registeredUserId });
          }
        });
      }
      onlineUsers.delete(registeredUserId);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
