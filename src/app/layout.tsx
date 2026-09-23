import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alex Kariuki",
  description:
    "Portfolio of Alex Kariuki — Electrical & Electronics Engineer specializing in power systems, control, and automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
