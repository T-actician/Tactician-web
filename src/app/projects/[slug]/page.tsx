import { notFound } from "next/navigation";
import { getJSON } from "@/lib/b2";
import { CONTENT_KEY, PROJECTS_KEY, defaultContent, normalizeContent } from "@/lib/defaults";
import { Project, SiteContent } from "@/types/content";
import Navbar from "@/components/Navbar";
import TechnicalProjectView from "@/components/project-detail/TechnicalProjectView";
import SoftwareProjectView from "@/components/project-detail/SoftwareProjectView";

export const dynamic = "force-dynamic";

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content: SiteContent = normalizeContent(await getJSON(CONTENT_KEY, defaultContent));
  const projects = await getJSON<Project[]>(PROJECTS_KEY, []);
  const project = projects.find((p) => p.slug === slug && p.status === "published");

  if (!project) notFound();

  return (
    <main>
      <Navbar firstName={content.hero.firstName} lastName={content.hero.lastName} role={content.hero.role} />
      {project.projectType === "software" ? (
        <SoftwareProjectView project={project} />
      ) : (
        <TechnicalProjectView project={project} />
      )}
    </main>
  );
}
