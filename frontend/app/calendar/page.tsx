"use client";
import { useState } from "react";
import { generateCalendar, saveContent } from "../../lib/api";

const platforms = ["Instagram","Twitter","LinkedIn","Facebook"];
const tones = ["Professional","Casual","Funny","Inspirational","Educational"];
const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function CalendarPage() {
  const [form, setForm] = useState({ brand_name:"", niche:"", tone:"Professional", platforms:["Instagram"] });
  const [loading, setLoading] = useState(false);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [rawText, setRawText] = useState("");
  const [saved, setSaved] = useState(false);

  const togglePlatform = (p: string) => {
    setForm(f => ({...f, platforms: f.platforms.includes(p) ? f.platforms.filter(x=>x!==p) : [...f.platforms, p]}));
  };

  function parseCalendar(text: string) {
    const entries: any[] = [];
    const blocks = text.split("---").filter(b => b.trim());
    for (const block of blocks) {
      const get = (key: string) => { const m = block.match(new RegExp(key+":\\s*(.+)")); return m ? m[1].trim() : ""; };
      const day = get("DAY"); const idea = get("IDEA");
      if (day && idea) entries.push({ day: get("DAY"), platform: get("PLATFORM"), type: get("TYPE"), topic: get("TOPIC"), idea: get("IDEA") });
    }
    return entries.length > 0 ? entries : days.map((d,i) => ({ day: d, platform: form.platforms[0] || "Instagram", type: "Post", topic: "Content", idea: text.split("\n").filter(l=>l.trim())[i] || "Content idea for " + d }));
  }

  async function handleGenerate() {
    if (!form.brand_name || !form.niche) return alert("Please fill in Brand Name and Niche");
    setLoading(true); setSaved(false);
    try {
      const res = await generateCalendar(form.brand_name, form.niche, form.platforms, form.tone);
      setRawText(res.content);
      setCalendar(parseCalendar(res.content));
    } catch (e: any) { alert("Error: " + (e.response?.data?.detail || e.message)); }
    finally { setLoading(false); }
  }

  async function handleSave() {
    try {
      await saveContent({ content_type:"calendar", platform:form.platforms.join(","), topic:form.niche, tone:form.tone.toLowerCase(), generated_text: rawText, hashtags:"" });
      setSaved(true);
    } catch { alert("Save failed"); }
  }

  const dayColors: Record<string,string> = {
    Monday:"#6366f1", Tuesday:"#8b5cf6", Wednesday:"#ec4899",
    Thursday:"#f59e0b", Friday:"#10b981", Saturday:"#3b82f6", Sunday:"#ef4444"
  };

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"1.5rem"}}>
      <div>
        <h1 style={{fontSize:"1.875rem", fontWeight:700, color:"white", margin:0}}>📅 Content Calendar</h1>
        <p style={{color:"#9ca3af", marginTop:"0.25rem"}}>Generate a full 7-day content plan for your brand</p>
      </div>

      {/* Form */}
      <div className="glass-card" style={{padding:"1.5rem"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1rem", marginBottom:"1rem"}}>
          <div>
            <label style={{color:"#9ca3af", fontSize:"0.875rem", display:"block", marginBottom:"0.5rem"}}>Brand Name</label>
            <input className="input-field" placeholder="e.g. FitLife Studio" value={form.brand_name} onChange={e=>setForm(f=>({...f,brand_name:e.target.value}))}/>
          </div>
          <div>
            <label style={{color:"#9ca3af", fontSize:"0.875rem", display:"block", marginBottom:"0.5rem"}}>Niche / Industry</label>
            <input className="input-field" placeholder="e.g. fitness, food, fashion" value={form.niche} onChange={e=>setForm(f=>({...f,niche:e.target.value}))}/>
          </div>
          <div>
            <label style={{color:"#9ca3af", fontSize:"0.875rem", display:"block", marginBottom:"0.5rem"}}>Tone</label>
            <select className="select-field" value={form.tone} onChange={e=>setForm(f=>({...f,tone:e.target.value}))}>
              {tones.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Platform selector */}
        <div style={{marginBottom:"1rem"}}>
          <label style={{color:"#9ca3af", fontSize:"0.875rem", display:"block", marginBottom:"0.5rem"}}>Platforms (select multiple)</label>
          <div style={{display:"flex", gap:"0.5rem"}}>
            {platforms.map(p => (
              <button key={p} onClick={()=>togglePlatform(p)} style={{
                padding:"0.5rem 1rem", borderRadius:"0.75rem", border:"1px solid",
                cursor:"pointer", fontSize:"0.875rem", fontWeight:500, transition:"all 0.2s",
                backgroundColor: form.platforms.includes(p) ? "rgba(99,102,241,0.2)" : "#1f2937",
                borderColor: form.platforms.includes(p) ? "#6366f1" : "#374151",
                color: form.platforms.includes(p) ? "#818cf8" : "#9ca3af"
              }}>{p}</button>
            ))}
          </div>
        </div>

        <div style={{display:"flex", gap:"0.75rem"}}>
          <button className="btn-primary" onClick={handleGenerate} disabled={loading} style={{padding:"0.75rem 2rem"}}>
            {loading ? "⏳ Generating Calendar..." : "⚡ Generate 7-Day Calendar"}
          </button>
          {calendar.length > 0 && (
            <button onClick={handleSave} disabled={saved} className="btn-secondary" style={{padding:"0.75rem 1.5rem"}}>
              {saved ? "✅ Saved!" : "💾 Save Calendar"}
            </button>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      {loading && (
        <div className="glass-card" style={{padding:"3rem", textAlign:"center"}}>
          <div style={{fontSize:"3rem", marginBottom:"1rem"}}>🤖</div>
          <p style={{color:"#6b7280"}}>Gemini AI is planning your week...</p>
        </div>
      )}

      {calendar.length > 0 && !loading && (
        <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"0.75rem"}}>
          {calendar.map((entry, i) => (
            <div key={i} className="glass-card" style={{padding:"1rem", borderTop:`3px solid ${dayColors[entry.day] || "#6366f1"}`}}>
              <div style={{marginBottom:"0.75rem"}}>
                <p style={{color: dayColors[entry.day] || "#6366f1", fontWeight:700, fontSize:"0.8rem", margin:"0 0 0.25rem 0", textTransform:"uppercase", letterSpacing:"0.05em"}}>{entry.day}</p>
                <span style={{padding:"0.2rem 0.5rem", backgroundColor:"rgba(99,102,241,0.15)", color:"#818cf8", borderRadius:"0.375rem", fontSize:"0.7rem"}}>
                  {entry.platform}
                </span>
              </div>
              <span style={{display:"inline-block", padding:"0.2rem 0.5rem", backgroundColor:"#1f2937", color:"#9ca3af", borderRadius:"0.375rem", fontSize:"0.7rem", marginBottom:"0.5rem"}}>
                {entry.type}
              </span>
              <p style={{color:"#e2e8f0", fontSize:"0.8rem", lineHeight:1.6, margin:"0.5rem 0 0 0"}}>{entry.idea}</p>
            </div>
          ))}
        </div>
      )}

      {calendar.length === 0 && !loading && (
        <div className="glass-card" style={{padding:"4rem", textAlign:"center"}}>
          <div style={{fontSize:"4rem", marginBottom:"1rem"}}>📅</div>
          <p style={{color:"#6b7280", fontSize:"1.125rem"}}>Fill in your brand details and generate a full week of content ideas</p>
        </div>
      )}
    </div>
  );
}