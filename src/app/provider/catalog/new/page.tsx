import { requireAuth } from '@/lib/auth';
import NewCatalogContent from './content';

export default async function NewCatalogPage() {
  await requireAuth();
  return <NewCatalogContent />;
}
