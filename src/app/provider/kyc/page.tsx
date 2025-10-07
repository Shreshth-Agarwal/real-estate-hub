import { requireAuth } from '@/lib/auth';
import KYCContent from './content';

export default async function KYCPage() {
  await requireAuth();
  return <KYCContent />;
}
