import { SiteContent } from "@/types/content";

export default function Footer({ content }: { content: SiteContent }) {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-500">
        <p>
          © {new Date().getFullYear()} {content.hero.firstName} {content.hero.lastName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
