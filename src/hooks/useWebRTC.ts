'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

export type ReceivedFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string; // object URL — lives in browser memory, not DB
  fromUserName: string;
  receivedAt: Date;
};

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

export function useWebRTC(
  socket: Socket | null,
  currentUserId: string | null,
  onFileReceived: (file: ReceivedFile) => void
) {
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);

  const createPeer = useCallback(
    (targetUserId: string): RTCPeerConnection => {
      // Clean up existing connection if any
      peersRef.current.get(targetUserId)?.close();

      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

      pc.onicecandidate = ({ candidate }) => {
        if (candidate && socket) {
          socket.emit('ice-candidate', { targetUserId, candidate });
        }
      };

      peersRef.current.set(targetUserId, pc);
      return pc;
    },
    [socket]
  );

  // ── Sender ────────────────────────────────────────────────────────────
  const sendFile = useCallback(
    async (file: File, targetUserId: string): Promise<void> => {
      if (!socket || !currentUserId) return;

      setIsSending(true);
      setSendProgress(0);

      const pc = createPeer(targetUserId);
      const channel = pc.createDataChannel('file-transfer', { ordered: true });

      channel.onopen = async () => {
        const buffer = await file.arrayBuffer();
        const chunkSize = 64 * 1024;
        const totalChunks = Math.ceil(buffer.byteLength / chunkSize);

        // 1. Send metadata
        channel.send(
          JSON.stringify({
            type: 'metadata',
            name: file.name,
            fileType: file.type,
            size: file.size,
          })
        );

        // 2. Send chunks
        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize;
          channel.send(buffer.slice(start, start + chunkSize));
          setSendProgress(Math.round(((i + 1) / totalChunks) * 100));

          // Back-pressure: wait for buffer to drain before filling it up
          if (channel.bufferedAmount > 1024 * 1024) {
            await new Promise<void>((res) => {
              const check = setInterval(() => {
                if (channel.bufferedAmount < 256 * 1024) {
                  clearInterval(check);
                  res();
                }
              }, 50);
            });
          }
        }

        // 3. Signal end
        channel.send(JSON.stringify({ type: 'end' }));
        setIsSending(false);
        setSendProgress(0);
      };

      channel.onerror = () => {
        setIsSending(false);
        setSendProgress(0);
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('webrtc-offer', { targetUserId, offer });
    },
    [socket, currentUserId, createPeer]
  );

  // ── Receiver (incoming signals) ───────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleOffer = async ({
      fromUserId,
      fromUserName,
      offer,
    }: {
      fromUserId: string;
      fromUserName: string;
      offer: RTCSessionDescriptionInit;
    }) => {
      const pc = createPeer(fromUserId);

      pc.ondatachannel = ({ channel }) => {
        let meta: { name: string; fileType: string; size: number } | null = null;
        const chunks: ArrayBuffer[] = [];

        channel.onmessage = ({ data }) => {
          if (typeof data === 'string') {
            const msg = JSON.parse(data) as { type: string; name?: string; fileType?: string; size?: number };
            if (msg.type === 'metadata') {
              meta = { name: msg.name!, fileType: msg.fileType!, size: msg.size! };
            } else if (msg.type === 'end' && meta) {
              const blob = new Blob(chunks, { type: meta.fileType });
              const url = URL.createObjectURL(blob);
              onFileReceived({
                id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                name: meta.name,
                type: meta.fileType,
                size: meta.size,
                url,
                fromUserName,
                receivedAt: new Date(),
              });
            }
          } else {
            chunks.push(data as ArrayBuffer);
          }
        };
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('webrtc-answer', { targetUserId: fromUserId, answer });
    };

    const handleAnswer = async ({
      fromUserId,
      answer,
    }: {
      fromUserId: string;
      answer: RTCSessionDescriptionInit;
    }) => {
      const pc = peersRef.current.get(fromUserId);
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleIce = async ({
      fromUserId,
      candidate,
    }: {
      fromUserId: string;
      candidate: RTCIceCandidateInit;
    }) => {
      const pc = peersRef.current.get(fromUserId);
      if (pc && candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
    };

    socket.on('webrtc-offer', handleOffer);
    socket.on('webrtc-answer', handleAnswer);
    socket.on('ice-candidate', handleIce);

    return () => {
      socket.off('webrtc-offer', handleOffer);
      socket.off('webrtc-answer', handleAnswer);
      socket.off('ice-candidate', handleIce);
    };
  }, [socket, createPeer, onFileReceived]);

  // Revoke object URLs and close peer connections on unmount
  useEffect(() => {
    return () => {
      peersRef.current.forEach((pc) => pc.close());
      peersRef.current.clear();
    };
  }, []);

  return { sendFile, isSending, sendProgress };
}
