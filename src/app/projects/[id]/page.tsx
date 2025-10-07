import { requireAuth } from '@/lib/auth';
import ProjectDetailContent from './content';

export default async function ProjectDetailPage() {
  await requireAuth();
  return <ProjectDetailContent />;
}
