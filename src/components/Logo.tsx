import Image from "next/image";

export default function Logo({ size = 44 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative shrink-0 overflow-hidden rounded-full"
    >
      <Image
        src="/logo.png"
        alt="Alex Kariuki logo"
        fill
        priority
        sizes={`${size}px`}
        className="object-cover"
      />
    </div>
  );
}
