import { requireAuth } from '@/lib/auth';
import CatalogsContent from './content';

export default async function CatalogsPage() {
  await requireAuth();
  return <CatalogsContent />;
}
