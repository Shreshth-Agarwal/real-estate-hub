import { requireAuth } from '@/lib/auth';
import ProviderQuoteSubmissionContent from './content';

export default async function ProviderQuoteSubmissionPage() {
  await requireAuth();
  return <ProviderQuoteSubmissionContent />;
}
