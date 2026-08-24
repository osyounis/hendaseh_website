import type { Metadata } from 'next';
import TokensClient from './TokensClient';

export const metadata: Metadata = {
  title: 'Design Tokens (internal)',
  robots: { index: false, follow: false },
};

export default function TokensPage() {
  return <TokensClient />;
}
