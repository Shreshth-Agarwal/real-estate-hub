import { requireAuth } from '@/lib/auth';
import ProjectWorkspaceContent from './content';

export default async function ProjectWorkspacePage() {
  await requireAuth();
  return <ProjectWorkspaceContent />;
}
