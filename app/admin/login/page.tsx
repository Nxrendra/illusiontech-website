import { headers } from 'next/headers';
import LoginClientView from './LoginClientView';

export default function AdminLoginPage() {
  const nonce = headers().get('x-nonce') || undefined;
  return <LoginClientView nonce={nonce} />;
}
