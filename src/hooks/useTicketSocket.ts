import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export type TicketSocketEvent =
  | 'ticket_new'
  | 'ticket_updated'
  | 'ticket_deleted'
  | 'ticket_status_changed';

type TicketSocketCallback = (event: TicketSocketEvent, data: any) => void;

/**
 * Reusable hook that connects to Socket.io, joins the correct rooms,
 * and fires `onEvent` whenever a ticket-related socket event arrives.
 */
export function useTicketSocket(onEvent: TicketSocketCallback) {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const cbRef = useRef<TicketSocketCallback>(onEvent);
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
    console.log(`[TicketSocket] Connecting for userId: ${userId} to ${SOCKET_URL}...`);

    socket.on('connect', () => {
      console.log(`[TicketSocket] Connected successfully with socket ID: ${socket.id}`);
    });

    const events: TicketSocketEvent[] = [
      'ticket_new',
      'ticket_updated',
      'ticket_deleted',
      'ticket_status_changed',
    ];

    events.forEach(ev => {
      socket.on(ev, (data: any) => {
        console.log(`[TicketSocket] Received event "${ev}" with data:`, data);
        cbRef.current(ev, data);
      });
    });

    socket.on('connect_error', (err) => {
      console.error('[TicketSocket] connect error:', err.message);
    });

    return () => {
      console.log('[TicketSocket] Cleaning up socket connection...');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);
}
