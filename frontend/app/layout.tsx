import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SocialAI — AI Social Media Assistant",
  description: "Generate posts, captions, hashtags and content calendars with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{margin:0, padding:0, backgroundColor:"#030712", color:"#f3f4f6"}}>
        <div style={{display:"flex", minHeight:"100vh", backgroundColor:"#030712"}}>
          <Sidebar />
          <main style={{flex:1, marginLeft:"16rem", padding:"2rem", overflowY:"auto"}}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}