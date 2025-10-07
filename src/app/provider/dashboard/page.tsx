import { requireAuth } from '@/lib/auth';
import ProviderDashboardContent from './content';

export default async function ProviderDashboardPage() {
  await requireAuth();
  return <ProviderDashboardContent />;
}
