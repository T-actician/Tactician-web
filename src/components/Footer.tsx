import { SiteContent } from "@/types/content";

export default function Footer({ content }: { content: SiteContent }) {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-sm text-slate-500 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {content.hero.firstName} {content.hero.lastName}. All rights reserved.
        </p>
        <p>{content.hero.role}</p>
      </div>
    </footer>
  );
}
