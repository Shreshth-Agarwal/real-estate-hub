import { requireAuth } from '@/lib/auth';
import ProjectsContent from './content';

export default async function ProjectsPage() {
  await requireAuth();
  return <ProjectsContent />;
}
