"use client";
import { useState } from "react";
import { generatePost, generateCaption, generateHashtags, generateIdeas, saveContent } from "../../lib/api";

const tabs = ["Post", "Caption", "Hashtags", "Ideas"];
const platforms = ["Instagram", "Twitter", "LinkedIn", "Facebook"];
const tones = ["Professional", "Casual", "Funny", "Inspirational", "Educational", "Promotional"];

export default function GeneratePage() {
  const [activeTab, setActiveTab] = useState("Post");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    topic: "", platform: "Instagram", tone: "Professional",
    extra: "", image_description: "", niche: "", count: "15"
  });

  const update = (k: string, v: string) => { setForm(f => ({...f, [k]: v})); setResult(""); setSaved(false); };

  async function handleGenerate() {
    setLoading(true); setResult(""); setSaved(false);
    try {
      let res: any;
      if (activeTab === "Post")     res = await generatePost(form.topic, form.platform, form.tone, form.extra);
      if (activeTab === "Caption")  res = await generateCaption(form.image_description, form.platform, form.tone);
      if (activeTab === "Hashtags") res = await generateHashtags(form.topic, form.platform, parseInt(form.count));
      if (activeTab === "Ideas")    res = await generateIdeas(form.niche, form.platform, 5);
      setResult(res.content);
    } catch (e: any) {
      setResult("Error: " + (e.response?.data?.detail || e.message));
    } finally { setLoading(false); }
  }

  async function handleSave() {
    try {
      await saveContent({
        content_type: activeTab.toLowerCase(),
        platform: form.platform.toLowerCase(),
        topic: form.topic || form.niche || form.image_description,
        tone: form.tone.toLowerCase(),
        generated_text: result,
        hashtags: activeTab === "Hashtags" ? result : ""
      });
      setSaved(true);
    } catch (e) { alert("Save failed"); }
  }

  const box = (label: string, children: React.ReactNode) => (
    <div style={{marginBottom:"1.25rem"}}>
      <label style={{display:"block", color:"#9ca3af", fontSize:"0.875rem", marginBottom:"0.5rem", fontWeight:500}}>{label}</label>
      {children}
    </div>
  );

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"1.5rem"}}>
      {/* Header */}
      <div>
        <h1 style={{fontSize:"1.875rem", fontWeight:700, color:"white", margin:0}}>✨ AI Generator</h1>
        <p style={{color:"#9ca3af", marginTop:"0.25rem"}}>Generate professional social media content instantly</p>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem"}}>
        {/* LEFT — Form */}
        <div className="glass-card" style={{padding:"1.5rem"}}>
          {/* Tabs */}
          <div style={{display:"flex", gap:"0.5rem", marginBottom:"1.5rem", backgroundColor:"#1f2937", borderRadius:"0.75rem", padding:"0.25rem"}}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setResult(""); }} style={{
                flex:1, padding:"0.5rem", borderRadius:"0.625rem", border:"none", cursor:"pointer",
                fontWeight:500, fontSize:"0.875rem", transition:"all 0.2s",
                backgroundColor: activeTab === tab ? "#4f46e5" : "transparent",
                color: activeTab === tab ? "white" : "#9ca3af"
              }}>{tab}</button>
            ))}
          </div>

          {/* Platform */}
          {box("Platform",
            <select className="select-field" value={form.platform} onChange={e => update("platform", e.target.value)}>
              {platforms.map(p => <option key={p}>{p}</option>)}
            </select>
          )}

          {/* Tone */}
          {box("Brand Tone",
            <select className="select-field" value={form.tone} onChange={e => update("tone", e.target.value)}>
              {tones.map(t => <option key={t}>{t}</option>)}
            </select>
          )}

          {/* Dynamic fields per tab */}
          {activeTab === "Post" && (<>
            {box("Topic / Subject", <input className="input-field" placeholder="e.g. New product launch, summer sale..." value={form.topic} onChange={e => update("topic", e.target.value)}/>)}
            {box("Extra Instructions (optional)", <textarea className="input-field" rows={2} placeholder="e.g. mention free shipping, include a question..." value={form.extra} onChange={e => update("extra", e.target.value)} style={{resize:"none"}}/>)}
          </>)}

          {activeTab === "Caption" && (<>
            {box("Describe Your Image", <textarea className="input-field" rows={3} placeholder="e.g. Person hiking on a mountain at sunset, wearing red jacket..." value={form.image_description} onChange={e => update("image_description", e.target.value)} style={{resize:"none"}}/>)}
          </>)}

          {activeTab === "Hashtags" && (<>
            {box("Topic", <input className="input-field" placeholder="e.g. fitness, food, travel..." value={form.topic} onChange={e => update("topic", e.target.value)}/>)}
            {box("How many hashtags?",
              <select className="select-field" value={form.count} onChange={e => update("count", e.target.value)}>
                {["10","15","20","25","30"].map(n => <option key={n}>{n}</option>)}
              </select>
            )}
          </>)}

          {activeTab === "Ideas" && (<>
            {box("Your Niche / Industry", <input className="input-field" placeholder="e.g. fitness, food, fashion, tech..." value={form.niche} onChange={e => update("niche", e.target.value)}/>)}
          </>)}

          {/* Generate Button */}
          <button className="btn-primary" onClick={handleGenerate}
            disabled={loading} style={{width:"100%", fontSize:"1rem", padding:"0.875rem"}}>
            {loading ? "⏳ Generating..." : "⚡ Generate with AI"}
          </button>
        </div>

        {/* RIGHT — Result */}
        <div className="glass-card" style={{padding:"1.5rem", display:"flex", flexDirection:"column"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem"}}>
            <h2 style={{color:"white", margin:0, fontSize:"1.125rem", fontWeight:600}}>Generated Content</h2>
            {result && !result.startsWith("Error") && (
              <div style={{display:"flex", gap:"0.5rem"}}>
                <button onClick={() => navigator.clipboard.writeText(result)}
                  style={{padding:"0.375rem 0.75rem", backgroundColor:"#1f2937", color:"#9ca3af", border:"1px solid #374151", borderRadius:"0.5rem", cursor:"pointer", fontSize:"0.8rem"}}>
                  📋 Copy
                </button>
                <button onClick={handleSave} disabled={saved}
                  style={{padding:"0.375rem 0.75rem", backgroundColor: saved ? "#065f46" : "#1f2937", color: saved ? "#34d399" : "#9ca3af", border:"1px solid #374151", borderRadius:"0.5rem", cursor:"pointer", fontSize:"0.8rem"}}>
                  {saved ? "✅ Saved!" : "💾 Save"}
                </button>
              </div>
            )}
          </div>

          {/* Result Display */}
          <div style={{flex:1, backgroundColor:"#0f172a", borderRadius:"0.75rem", padding:"1.25rem", minHeight:"300px", border:"1px solid #1e293b"}}>
            {loading ? (
              <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:"100%"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:"2rem", marginBottom:"0.5rem"}}>🤖</div>
                  <p style={{color:"#6b7280"}}>Gemini AI is thinking...</p>
                </div>
              </div>
            ) : result ? (
              <p style={{color:"#e2e8f0", lineHeight:1.8, margin:0, whiteSpace:"pre-wrap", fontSize:"0.95rem"}}>{result}</p>
            ) : (
              <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:"100%", flexDirection:"column", gap:"0.5rem"}}>
                <div style={{fontSize:"3rem"}}>✨</div>
                <p style={{color:"#4b5563", textAlign:"center"}}>Fill in the form and click<br/><strong style={{color:"#6366f1"}}>Generate with AI</strong></p>
              </div>
            )}
          </div>

          {/* Tip */}
          <div style={{marginTop:"1rem", padding:"0.75rem", backgroundColor:"rgba(99,102,241,0.1)", borderRadius:"0.75rem", border:"1px solid rgba(99,102,241,0.2)"}}>
            <p style={{color:"#818cf8", fontSize:"0.8rem", margin:0}}>
              💡 <strong>Tip:</strong> After generating, save the content and it will appear in your Saved Content page and on the Dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}