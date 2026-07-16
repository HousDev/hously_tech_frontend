import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export type TaskSocketEvent =
  | 'task_created'
  | 'task_updated'
  | 'task_deleted'
  | 'task_comment_added'
  | 'task_status_updated'
  | 'new_notification';

type TaskSocketCallback = (event: TaskSocketEvent, data: any) => void;

/**
 * Reusable hook that connects to Socket.io, joins rooms,
 * and fires `onEvent` whenever a task-related socket event arrives.
 */
export function useTaskSocket(onEvent: TaskSocketCallback) {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const cbRef = useRef<TaskSocketCallback>(onEvent);
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
    console.log(`[TaskSocket] Connecting for userId: ${userId} to ${SOCKET_URL}...`);

    socket.on('connect', () => {
      console.log(`[TaskSocket] Connected successfully with socket ID: ${socket.id}`);
    });

    const events: TaskSocketEvent[] = [
      'task_created',
      'task_updated',
      'task_deleted',
      'task_comment_added',
      'task_status_updated',
      'new_notification',
    ];

    events.forEach(ev => {
      socket.on(ev, (data: any) => {
        console.log(`[TaskSocket] Received event "${ev}" with data:`, data);
        cbRef.current(ev, data);
      });
    });

    socket.on('connect_error', (err) => {
      console.error('[TaskSocket] connect error:', err.message);
    });

    return () => {
      console.log('[TaskSocket] Cleaning up socket connection...');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);
}
