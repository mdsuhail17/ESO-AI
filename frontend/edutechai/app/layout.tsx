import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eso AI Agent",
  description: "AI-powered study companion for students and teachers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-satoshi antialiased">
        {children}
      </body>
    </html>
  );
}
