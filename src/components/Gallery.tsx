"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectMediaItem } from "@/types/content";

export default function Gallery({ items }: { items: ProjectMediaItem[] }) {
  const [index, setIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  const close = () => setIndex(null);
  const prev = () => setIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  const next = () => setIndex((i) => (i === null ? null : (i + 1) % items.length));

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item, i) => (
          <button
            key={item.key}
            onClick={() => setIndex(i)}
            className="relative aspect-square overflow-hidden rounded-xl shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Image src={`/api/media/${item.key}`} alt={item.caption || ""} fill className="object-cover" />
          </button>
        ))}
      </div>

      {index !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
          <button onClick={close} className="absolute right-6 top-6 text-white" aria-label="Close">
            <X size={28} />
          </button>
          <button onClick={prev} className="absolute left-4 text-white" aria-label="Previous">
            <ChevronLeft size={36} />
          </button>
          <div className="relative h-[80vh] w-full max-w-4xl">
            <Image
              src={`/api/media/${items[index].key}`}
              alt={items[index].caption || ""}
              fill
              className="object-contain"
            />
          </div>
          <button onClick={next} className="absolute right-4 text-white" aria-label="Next">
            <ChevronRight size={36} />
          </button>
          {items[index].caption && (
            <p className="absolute bottom-6 text-sm text-white/80">{items[index].caption}</p>
          )}
        </div>
      )}
    </div>
  );
}
