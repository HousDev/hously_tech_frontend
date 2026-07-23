import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export type AdvanceSocketEvent =
  | 'advance_new'
  | 'advance_status_changed'
  | 'advance_deleted';

type AdvanceSocketCallback = (event: AdvanceSocketEvent, data: any) => void;

/**
 * Reusable hook that connects to Socket.io for Advance Salary events,
 * joins the correct rooms, and fires `onEvent` whenever an event arrives.
 */
export function useAdvanceSocket(onEvent: AdvanceSocketCallback) {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const cbRef = useRef<AdvanceSocketCallback>(onEvent);
  cbRef.current = onEvent; // keep latest callback without re-subscribing

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    const userId = user.id;

    const socket = io(SOCKET_URL, {
      auth: { token, userId },
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;
    console.log(`[AdvanceSocket] Connecting for userId: ${userId} to ${SOCKET_URL}...`);

    socket.on('connect', () => {
      console.log(`[AdvanceSocket] Connected successfully with socket ID: ${socket.id}`);
    });

    const events: AdvanceSocketEvent[] = [
      'advance_new',
      'advance_status_changed',
      'advance_deleted',
    ];

    events.forEach(ev => {
      socket.on(ev, (data: any) => {
        console.log(`[AdvanceSocket] Received event "${ev}" with data:`, data);
        cbRef.current(ev, data);
      });
    });

    socket.on('connect_error', (err) => {
      console.error('[AdvanceSocket] connect error:', err.message);
    });

    return () => {
      console.log('[AdvanceSocket] Cleaning up socket connection...');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);
}
