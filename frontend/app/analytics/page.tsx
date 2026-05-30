"use client";
import { useEffect, useState } from "react";
import { getAnalytics } from "../../lib/api";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const mockWeekly = [
    {day:"Mon", count:4}, {day:"Tue", count:7}, {day:"Wed", count:3},
    {day:"Thu", count:9}, {day:"Fri", count:6}, {day:"Sat", count:2}, {day:"Sun", count:5}
  ];
  const maxCount = Math.max(...mockWeekly.map(d=>d.count));

  const platformColors: Record<string,string> = {
    instagram:"#e1306c", twitter:"#1da1f2", linkedin:"#0077b5",
    facebook:"#1877f2", multiple:"#6366f1", unknown:"#6b7280"
  };

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"1.5rem"}}>
      <div>
        <h1 style={{fontSize:"1.875rem", fontWeight:700, color:"white", margin:0}}>📊 Analytics</h1>
        <p style={{color:"#9ca3af", marginTop:"0.25rem"}}>Track your content generation activity</p>
      </div>

      {/* Top Stats */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem"}}>
        {[
          {label:"Total Generated", value: data?.total_generated ?? 0, icon:"⚡", color:"#6366f1"},
          {label:"Platforms Active", value: Object.keys(data?.by_platform??{}).length, icon:"📱", color:"#10b981"},
          {label:"Content Types",   value: Object.keys(data?.by_content_type??{}).length, icon:"🎨", color:"#f59e0b"},
        ].map(({label,value,icon,color}) => (
          <div key={label} className="glass-card" style={{padding:"1.5rem"}}>
            <div style={{display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.75rem"}}>
              <span style={{fontSize:"1.5rem"}}>{icon}</span>
              <p style={{color:"#9ca3af", fontSize:"0.875rem", margin:0}}>{label}</p>
            </div>
            <p style={{fontSize:"2.5rem", fontWeight:700, color, margin:0}}>
              {loading ? "—" : value}
            </p>
          </div>
        ))}
      </div>

      <div style={{display:"grid", gridTemplateColumns:"2fr 1fr", gap:"1.5rem"}}>
        {/* Weekly Activity Chart */}
        <div className="glass-card" style={{padding:"1.5rem"}}>
          <h2 style={{color:"white", margin:"0 0 1.5rem 0", fontSize:"1.125rem", fontWeight:600}}>Weekly Activity (Mock)</h2>
          <div style={{display:"flex", alignItems:"flex-end", gap:"0.75rem", height:"200px"}}>
            {mockWeekly.map(({day,count}) => (
              <div key={day} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"0.5rem", height:"100%", justifyContent:"flex-end"}}>
                <span style={{color:"#9ca3af", fontSize:"0.75rem"}}>{count}</span>
                <div style={{
                  width:"100%", borderRadius:"0.375rem 0.375rem 0 0",
                  height:`${(count/maxCount)*160}px`,
                  background:"linear-gradient(to top, #4f46e5, #818cf8)",
                  transition:"height 0.5s ease"
                }}/>
                <span style={{color:"#6b7280", fontSize:"0.75rem"}}>{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Platform */}
        <div className="glass-card" style={{padding:"1.5rem"}}>
          <h2 style={{color:"white", margin:"0 0 1.5rem 0", fontSize:"1.125rem", fontWeight:600}}>By Platform</h2>
          {loading ? <p style={{color:"#6b7280"}}>Loading...</p> :
           Object.keys(data?.by_platform??{}).length === 0 ? (
            <p style={{color:"#6b7280", fontSize:"0.875rem"}}>No data yet. Start generating content!</p>
           ) : (
            <div style={{display:"flex", flexDirection:"column", gap:"0.75rem"}}>
              {Object.entries(data?.by_platform??{}).map(([platform, count]: any) => {
                const total = data?.total_generated || 1;
                const pct = Math.round((count/total)*100);
                return (
                  <div key={platform}>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:"0.375rem"}}>
                      <span style={{color:"#e2e8f0", fontSize:"0.875rem", textTransform:"capitalize"}}>{platform}</span>
                      <span style={{color:"#9ca3af", fontSize:"0.875rem"}}>{count} ({pct}%)</span>
                    </div>
                    <div style={{backgroundColor:"#1f2937", borderRadius:"9999px", height:"8px"}}>
                      <div style={{height:"8px", borderRadius:"9999px", width:`${pct}%`, backgroundColor: platformColors[platform]||"#6366f1", transition:"width 0.5s ease"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
           )}
        </div>
      </div>

      {/* By Content Type */}
      <div className="glass-card" style={{padding:"1.5rem"}}>
        <h2 style={{color:"white", margin:"0 0 1.5rem 0", fontSize:"1.125rem", fontWeight:600}}>By Content Type</h2>
        {loading ? <p style={{color:"#6b7280"}}>Loading...</p> :
         Object.keys(data?.by_content_type??{}).length === 0 ? (
          <p style={{color:"#6b7280"}}>No data yet.</p>
         ) : (
          <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"1rem"}}>
            {Object.entries(data?.by_content_type??{}).map(([type, count]: any) => (
              <div key={type} className="glass-card" style={{padding:"1.25rem", textAlign:"center"}}>
                <p style={{fontSize:"2rem", fontWeight:700, color:"#818cf8", margin:"0 0 0.25rem 0"}}>{count}</p>
                <p style={{color:"#9ca3af", fontSize:"0.8rem", margin:0, textTransform:"capitalize"}}>{type}</p>
              </div>
            ))}
          </div>
         )}
      </div>
    </div>
  );
}