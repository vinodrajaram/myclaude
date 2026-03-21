import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beehive",
  description: "Privacy-first AI meeting intelligence for bankers",
};

// Prevent FOUC: apply theme class before first paint
const themeScript = `(function(){
  try {
    var t = localStorage.getItem('beehive-theme');
    document.documentElement.classList.add(t === 'light' ? 'light' : 'dark');
  } catch(e) {
    document.documentElement.classList.add('dark');
  }
})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}
