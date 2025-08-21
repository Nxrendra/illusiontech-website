import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

let pusherServerInstance: PusherServer | null = null;

export const getPusherServer = (): PusherServer => {
  if (!pusherServerInstance) {
    // All credentials must be available when this is called.
    pusherServerInstance = new PusherServer({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      useTLS: true,
    });
  }
  return pusherServerInstance;
};

// Note: Pusher-js should only be used on the client-side.
export const getPusherClient = () => {
    // Singleton pattern to avoid creating multiple clients
    if (!(global as any).pusherClient) {
        (global as any).pusherClient = new PusherClient(
            process.env.NEXT_PUBLIC_PUSHER_KEY!,
            {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            }
        );
    }
    return (global as any).pusherClient;
}