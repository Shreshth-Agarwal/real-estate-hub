import { requireAuth } from '@/lib/auth';
import AdminContent from './content';

export default async function AdminPage() {
  await requireAuth();
  return <AdminContent />;
}
