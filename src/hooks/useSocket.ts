'use client';

import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '@/lib/socket';

export type NearbyUser = {
  userId: string;
  userName: string;
};

export function useSocket(currentUser: { id: string; userName: string } | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!currentUser) return;

    const s = getSocket();
    setSocket(s);

    const register = () => {
      if (registeredRef.current) return;
      registeredRef.current = true;
      s.emit('register', { userId: currentUser.id, userName: currentUser.userName });
    };

    const onConnect = () => {
      setIsConnected(true);
      registeredRef.current = false;
      register();
    };

    const onDisconnect = () => {
      setIsConnected(false);
      registeredRef.current = false;
    };

    const onNearbyUsers = (users: NearbyUser[]) => setNearbyUsers(users);

    const onUserJoined = (user: NearbyUser) => {
      setNearbyUsers((prev) =>
        prev.find((u) => u.userId === user.userId) ? prev : [...prev, user]
      );
    };

    const onUserLeft = ({ userId }: { userId: string }) => {
      setNearbyUsers((prev) => prev.filter((u) => u.userId !== userId));
    };

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    s.on('nearby-users', onNearbyUsers);
    s.on('user-joined', onUserJoined);
    s.on('user-left', onUserLeft);

    if (s.connected) {
      setIsConnected(true);
      register();
    }

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.off('nearby-users', onNearbyUsers);
      s.off('user-joined', onUserJoined);
      s.off('user-left', onUserLeft);
      registeredRef.current = false;
    };
  }, [currentUser]);

  return { socket, nearbyUsers, isConnected };
}
