"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Sparkles, Calendar, BookMarked, BarChart3, Zap } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard",     icon: LayoutDashboard },
  { href: "/generate",  label: "AI Generator",  icon: Sparkles },
  { href: "/calendar",  label: "Calendar",      icon: Calendar },
  { href: "/saved",     label: "Saved Content", icon: BookMarked },
  { href: "/analytics", label: "Analytics",     icon: BarChart3 },
];

export default function sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      position: "fixed", left: 0, top: 0, height: "100vh", width: "16rem",
      backgroundColor: "#111827", borderRight: "1px solid #1f2937",
      display: "flex", flexDirection: "column", zIndex: 50
    }}>
      {/* Logo */}
      <div style={{padding: "1.5rem", borderBottom: "1px solid #1f2937"}}>
        <div style={{display: "flex", alignItems: "center", gap: "0.75rem"}}>
          <div style={{
            width: "2.25rem", height: "2.25rem",
            background: "linear-gradient(135deg, #6366f1, #7c3aed)",
            borderRadius: "0.75rem", display: "flex",
            alignItems: "center", justifyContent: "center"
          }}>
            <Zap size={18} color="white" />
          </div>
          <div>
            <p style={{fontWeight: 700, color: "white", fontSize: "0.875rem"}}>SocialAI</p>
            <p style={{fontSize: "0.75rem", color: "#6b7280"}}>Content Assistant</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{flex: 1, padding: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem"}}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.75rem 1rem", borderRadius: "0.75rem",
              transition: "all 0.2s", fontSize: "0.875rem", fontWeight: 500,
              textDecoration: "none",
              backgroundColor: active ? "#4f46e5" : "transparent",
              color: active ? "white" : "#9ca3af",
              boxShadow: active ? "0 4px 15px rgba(99,102,241,0.3)" : "none"
            }}
            onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.backgroundColor = "#1f2937"; (e.currentTarget as HTMLElement).style.color = "white"; }}}
            onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#9ca3af"; }}}>
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{padding: "1rem", borderTop: "1px solid #1f2937"}}>
        <div style={{
          backgroundColor: "#1f2937", border: "1px solid #374151",
          borderRadius: "0.75rem", padding: "0.75rem", textAlign: "center"
        }}>
          <p style={{fontSize: "0.75rem", color: "#6b7280"}}>Powered by</p>
          <p style={{
            fontSize: "0.75rem", fontWeight: 600,
            background: "linear-gradient(to right, #818cf8, #c084fc)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>Google Gemini AI</p>
        </div>
      </div>
    </aside>
  );
}