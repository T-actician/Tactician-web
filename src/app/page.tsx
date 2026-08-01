import { getJSON } from "@/lib/b2";
import { CONTENT_KEY, PROJECTS_KEY, defaultContent, normalizeContent } from "@/lib/defaults";
import { Project, SiteContent } from "@/types/content";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import SkillsSidebar from "@/components/SkillsSidebar";
import FeaturedProjects from "@/components/FeaturedProjects";
import Experience from "@/components/Experience";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content: SiteContent = normalizeContent(await getJSON(CONTENT_KEY, defaultContent));
  const allProjects = await getJSON<Project[]>(PROJECTS_KEY, []);
  const published = allProjects
    .filter((p) => p.status === "published")
    .sort((a, b) => a.order - b.order);

  return (
    <main>
      <Navbar firstName={content.hero.firstName} lastName={content.hero.lastName} role={content.hero.role} />
      <Hero content={content} />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[1fr_0.55fr]">
        <div className="flex flex-col gap-10">
          <About content={content} />
          <FeaturedProjects projects={published} />
        </div>
        <SkillsSidebar content={content} />
      </div>

      <Experience items={content.experience} />
      <Testimonials items={content.testimonials} />
      <Contact content={content} />
      <Footer content={content} />
    </main>
  );
}
