"use client";
import { useEffect, useState } from "react";
import { getAnalytics, getAllContent } from "../../lib/api";
import Link from "next/link";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentContent, setRecentContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function load() {
    try {
      const [a, c] = await Promise.all([getAnalytics(), getAllContent()]);
      setAnalytics(a.data);
      setRecentContent(c.data?.slice(0, 5) || []);
    } catch (e) {
      setAnalytics({ total_generated: 0, by_platform: {}, by_content_type: {} });
      setRecentContent([]);
    } finally {
      setLoading(false);
    }
  }
  load();
}, []);

  const stats = [
    { label: "Total Generated", value: analytics?.total_generated ?? 0, color: "linear-gradient(135deg,#6366f1,#7c3aed)" },
    { label: "Saved Content",   value: recentContent.length,            color: "linear-gradient(135deg,#ec4899,#e11d48)" },
    { label: "Platforms Used",  value: Object.keys(analytics?.by_platform ?? {}).length,     color: "linear-gradient(135deg,#10b981,#0d9488)" },
    { label: "Content Types",   value: Object.keys(analytics?.by_content_type ?? {}).length, color: "linear-gradient(135deg,#f59e0b,#ea580c)" },
  ];

  const quickActions = [
    { label: "Generate Post",    href: "/generate", desc: "Create platform-specific posts" },
    { label: "Write Caption",    href: "/generate", desc: "Caption for your images" },
    { label: "Find Hashtags",    href: "/generate", desc: "Trending hashtag sets" },
    { label: "Content Calendar", href: "/calendar", desc: "Plan your entire week" },
  ];

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"2rem"}}>
      <div>
        <h1 style={{fontSize:"1.875rem", fontWeight:700, color:"white", margin:0}}>Welcome back 👋</h1>
        <p style={{color:"#9ca3af", marginTop:"0.25rem"}}>Your AI-powered social media command center</p>
      </div>

      {/* Stats */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem"}}>
        {stats.map(({label, value, color}) => (
          <div key={label} className="glass-card" style={{padding:"1.5rem"}}>
            <p style={{color:"#9ca3af", fontSize:"0.875rem", margin:"0 0 1rem 0"}}>{label}</p>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
              <p style={{fontSize:"2rem", fontWeight:700, color:"white", margin:0}}>
                {loading ? "—" : value}
              </p>
              <div style={{width:"2.5rem", height:"2.5rem", background:color, borderRadius:"0.75rem"}}/>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={{color:"white", marginBottom:"1rem", fontSize:"1.125rem", fontWeight:600}}>Quick Actions</h2>
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem"}}>
          {quickActions.map(({label, href, desc}) => (
            <Link key={label} href={href} style={{textDecoration:"none"}}>
              <div className="glass-card" style={{padding:"1.25rem", cursor:"pointer", transition:"border-color 0.2s"}}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor="#6366f1"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor="#1f2937"}>
                <p style={{fontWeight:600, color:"white", margin:"0 0 0.25rem 0"}}>{label}</p>
                <p style={{color:"#6b7280", fontSize:"0.875rem", margin:"0 0 0.75rem 0"}}>{desc}</p>
                <p style={{color:"#818cf8", fontSize:"0.875rem", margin:0}}>→</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Content */}
      <div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem"}}>
          <h2 style={{color:"white", margin:0, fontSize:"1.125rem", fontWeight:600}}>Recent Content</h2>
          <Link href="/saved" style={{color:"#818cf8", fontSize:"0.875rem"}}>View all →</Link>
        </div>
        <div className="glass-card" style={{overflow:"hidden"}}>
          {loading ? (
            <p style={{color:"#6b7280", padding:"1.5rem"}}>Loading...</p>
          ) : recentContent.length === 0 ? (
            <div style={{padding:"3rem", textAlign:"center"}}>
              <p style={{color:"#6b7280", marginBottom:"1rem"}}>No content yet. Start generating!</p>
              <Link href="/generate">
                <button className="btn-primary">Generate Content</button>
              </Link>
            </div>
          ) : (
            <table style={{width:"100%", borderCollapse:"collapse"}}>
              <thead>
                <tr style={{borderBottom:"1px solid #1f2937"}}>
                  {["Type","Platform","Topic","Tone"].map(h => (
                    <th key={h} style={{textAlign:"left", padding:"1rem", color:"#9ca3af", fontSize:"0.875rem", fontWeight:500}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentContent.map((item) => (
                  <tr key={item.id} style={{borderBottom:"1px solid #1f2937"}}>
                    <td style={{padding:"1rem"}}>
                      <span style={{padding:"0.25rem 0.5rem", backgroundColor:"rgba(99,102,241,0.2)", color:"#818cf8", borderRadius:"0.5rem", fontSize:"0.75rem", fontWeight:500, textTransform:"capitalize"}}>
                        {item.content_type}
                      </span>
                    </td>
                    <td style={{padding:"1rem", color:"#d1d5db", fontSize:"0.875rem", textTransform:"capitalize"}}>{item.platform}</td>
                    <td style={{padding:"1rem", color:"#d1d5db", fontSize:"0.875rem"}}>{item.topic}</td>
                    <td style={{padding:"1rem", color:"#9ca3af", fontSize:"0.875rem", textTransform:"capitalize"}}>{item.tone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}