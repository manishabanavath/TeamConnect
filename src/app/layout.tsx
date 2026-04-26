import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "TeamConnect - Find Your Ideal Team",
  description: "A platform for students to find team members for projects, hackathons, and competitions based on skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          <main className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
