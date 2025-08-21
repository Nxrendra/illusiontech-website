import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

let pusherServerInstance: PusherServer | null = null;

export const getPusherServer = (): PusherServer => {
  if (!pusherServerInstance) {
    const appId = process.env.PUSHER_APP_ID;
    const key = process.env.PUSHER_KEY;
    const secret = process.env.PUSHER_SECRET;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!appId || !key || !secret || !cluster) {
      throw new Error('Pusher server environment variables (PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, NEXT_PUBLIC_PUSHER_CLUSTER) are not configured.');
    }

    // All credentials must be available when this is called.
    pusherServerInstance = new PusherServer({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    });
  }
  return pusherServerInstance;
};

// Note: Pusher-js should only be used on the client-side.
export const getPusherClient = () => {
    // Singleton pattern to avoid creating multiple clients
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!(global as any).pusherClient) {
        if (!key || !cluster) {
          // This will log a warning in the browser console if the keys are missing.
          // It's better than crashing the client-side app.
          console.error('Pusher client environment variables (NEXT_PUBLIC_PUSHER_KEY, NEXT_PUBLIC_PUSHER_CLUSTER) are not configured.');
          // Return a mock object to prevent crashes on the client.
          return { subscribe: () => ({ bind: () => {} }), unsubscribe: () => {} };
        }
        (global as any).pusherClient = new PusherClient(
            key, { cluster }
        );
    }
    return (global as any).pusherClient;
}
