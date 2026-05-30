"use client";
import { useEffect, useState } from "react";
import { getAllContent, deleteContent, getExportUrl } from "../../lib/api";

export default function SavedPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  async function load() {
    try { const res = await getAllContent(); setItems(res.data || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this content?")) return;
    try { await deleteContent(id); setItems(items.filter(i => i.id !== id)); }
    catch { alert("Delete failed"); }
  }

  const typeColors: Record<string,string> = {
    post:"rgba(99,102,241,0.2)", caption:"rgba(236,72,153,0.2)",
    hashtags:"rgba(16,185,129,0.2)", ideas:"rgba(245,158,11,0.2)", calendar:"rgba(59,130,246,0.2)"
  };
  const typeText: Record<string,string> = {
    post:"#818cf8", caption:"#f472b6", hashtags:"#34d399", ideas:"#fbbf24", calendar:"#60a5fa"
  };

  const filtered = items.filter(item => {
    const matchType = filter === "all" || item.content_type === filter;
    const matchSearch = item.topic?.toLowerCase().includes(search.toLowerCase()) || item.generated_text?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"1.5rem"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
        <div>
          <h1 style={{fontSize:"1.875rem", fontWeight:700, color:"white", margin:0}}>💾 Saved Content</h1>
          <p style={{color:"#9ca3af", marginTop:"0.25rem"}}>{items.length} items saved</p>
        </div>
        <a href={getExportUrl()} download>
          <button className="btn-primary" style={{padding:"0.625rem 1.25rem"}}>⬇️ Export CSV</button>
        </a>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{padding:"1rem", display:"flex", gap:"0.75rem", alignItems:"center", flexWrap:"wrap"}}>
        <input className="input-field" placeholder="🔍 Search content..." value={search}
          onChange={e=>setSearch(e.target.value)} style={{flex:1, minWidth:"200px"}}/>
        {["all","post","caption","hashtags","ideas","calendar"].map(t => (
          <button key={t} onClick={()=>setFilter(t)} style={{
            padding:"0.5rem 1rem", borderRadius:"0.75rem", border:"1px solid", cursor:"pointer",
            fontSize:"0.8rem", fontWeight:500, textTransform:"capitalize", transition:"all 0.2s",
            backgroundColor: filter===t ? "rgba(99,102,241,0.2)" : "#1f2937",
            borderColor: filter===t ? "#6366f1" : "#374151",
            color: filter===t ? "#818cf8" : "#9ca3af"
          }}>{t}</button>
        ))}
      </div>

      {/* Content List */}
      {loading ? (
        <div className="glass-card" style={{padding:"3rem", textAlign:"center"}}>
          <p style={{color:"#6b7280"}}>Loading saved content...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{padding:"4rem", textAlign:"center"}}>
          <div style={{fontSize:"3rem", marginBottom:"1rem"}}>📭</div>
          <p style={{color:"#6b7280"}}>No saved content found</p>
        </div>
      ) : (
        <div style={{display:"flex", flexDirection:"column", gap:"1rem"}}>
          {filtered.map(item => (
            <div key={item.id} className="glass-card" style={{padding:"1.25rem"}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.75rem"}}>
                <div style={{display:"flex", gap:"0.5rem", alignItems:"center", flexWrap:"wrap"}}>
                  <span style={{padding:"0.25rem 0.625rem", backgroundColor:typeColors[item.content_type]||"rgba(99,102,241,0.2)", color:typeText[item.content_type]||"#818cf8", borderRadius:"0.5rem", fontSize:"0.75rem", fontWeight:600, textTransform:"capitalize"}}>
                    {item.content_type}
                  </span>
                  <span style={{padding:"0.25rem 0.625rem", backgroundColor:"#1f2937", color:"#9ca3af", borderRadius:"0.5rem", fontSize:"0.75rem", textTransform:"capitalize"}}>
                    {item.platform}
                  </span>
                  <span style={{padding:"0.25rem 0.625rem", backgroundColor:"#1f2937", color:"#9ca3af", borderRadius:"0.5rem", fontSize:"0.75rem", textTransform:"capitalize"}}>
                    {item.tone}
                  </span>
                </div>
                <button onClick={()=>handleDelete(item.id)} style={{
                  padding:"0.375rem 0.75rem", backgroundColor:"rgba(239,68,68,0.1)", color:"#f87171",
                  border:"1px solid rgba(239,68,68,0.3)", borderRadius:"0.5rem", cursor:"pointer", fontSize:"0.8rem"
                }}>🗑 Delete</button>
              </div>
              <p style={{color:"#6b7280", fontSize:"0.8rem", margin:"0 0 0.5rem 0"}}>Topic: {item.topic}</p>
              <p style={{color:"#e2e8f0", lineHeight:1.7, margin:0, fontSize:"0.9rem",
                display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden"}}>
                {item.generated_text}
              </p>
              {item.hashtags && (
                <p style={{color:"#818cf8", fontSize:"0.85rem", marginTop:"0.5rem"}}>{item.hashtags}</p>
              )}
              <p style={{color:"#4b5563", fontSize:"0.75rem", marginTop:"0.75rem"}}>
                {new Date(item.created_at).toLocaleDateString("en-IN", {day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}