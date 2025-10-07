import { requireAuth } from '@/lib/auth';
import ProviderSetupContent from './content';

export default async function ProviderSetupPage() {
  await requireAuth();
  return <ProviderSetupContent />;
}
