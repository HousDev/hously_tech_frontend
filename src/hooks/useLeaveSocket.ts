import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export type LeaveSocketEvent =
  | 'leave_new'
  | 'leave_updated'
  | 'leave_deleted'
  | 'leave_status_changed';

type LeaveSocketCallback = (event: LeaveSocketEvent, data: any) => void;

/**
 * Reusable hook that connects to Socket.io, joins the correct rooms,
 * and fires `onEvent` whenever a leave-related socket event arrives.
 */
export function useLeaveSocket(onEvent: LeaveSocketCallback) {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const cbRef = useRef<LeaveSocketCallback>(onEvent);
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
    console.log(`[LeaveSocket] Connecting for userId: ${userId} to ${SOCKET_URL}...`);

    socket.on('connect', () => {
      console.log(`[LeaveSocket] Connected successfully with socket ID: ${socket.id}`);
    });

    const events: LeaveSocketEvent[] = [
      'leave_new',
      'leave_updated',
      'leave_deleted',
      'leave_status_changed',
    ];

    events.forEach(ev => {
      socket.on(ev, (data: any) => {
        console.log(`[LeaveSocket] Received event "${ev}" with data:`, data);
        cbRef.current(ev, data);
      });
    });

    socket.on('connect_error', (err) => {
      console.error('[LeaveSocket] connect error:', err.message);
    });

    return () => {
      events.forEach(ev => socket.off(ev));
      socket.disconnect();
      socketRef.current = null;
      console.log('[LeaveSocket] Disconnected and cleaned up.');
    };
  }, [user]); // Reconnect when user mounts or changes
}
