import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Content Pipeline",
  description: "Design, import, and render social content.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
