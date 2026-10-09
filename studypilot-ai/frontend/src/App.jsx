import React, { useEffect, useState } from "react";

const API = "http://localhost:8000/api";

const stuckOptions = [
  ["💡", "Give me a hint"],
  ["🧠", "Explain simply"],
  ["🧪", "Give an example"],
  ["📝", "Show an exam answer"],
  ["🔁", "Give a similar question"],
];

function App() {
  const [subject, setSubject] = useState("DBMS");
  const [topic, setTopic] = useState("Normalization");
  const [goal, setGoal] = useState("Exam Prep");
  const [minutes, setMinutes] = useState(45);
  const [plan, setPlan] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { who: "ai", text: "Hi! I'm StudyPilot. Tell me what you're studying and I'll help you make it easier." }
  ]);
  const [progress, setProgress] = useState({ sessions: 0, minutes: 0, questions: 0, streak: 1 });
  const [loading, setLoading] = useState(false);

  async function loadProgress() {
    try {
      const r = await fetch(`${API}/progress`);
      setProgress(await r.json());
    } catch {}
  }

  useEffect(() => { loadProgress(); }, []);

  async function generatePlan() {
    setLoading(true);
    try {
      const r = await fetch(`${API}/study-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic, goal, minutes: Number(minutes) })
      });
      setPlan(await r.json());
      await loadProgress();
    } catch {
      alert("Start the backend first. See README.md.");
    }
    setLoading(false);
  }

  async function send(text = message) {
    if (!text.trim()) return;
    setChat(c => [...c, { who: "me", text }]);
    setMessage("");
    try {
      const r = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, context: { subject, topic, goal } })
      });
      const data = await r.json();
      setChat(c => [...c, { who: "ai", text: data.reply }]);
    } catch {
      setChat(c => [...c, { who: "ai", text: "Please start the backend server, then try again." }]);
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><div className="logo">✦</div><div><b>StudyPilot</b><span>AI Study Coach</span></div></div>
        <nav>
          <button className="nav active">⌂ <span>Dashboard</span></button>
          <button className="nav">◈ <span>Study Sessions</span></button>
          <button className="nav">✓ <span>Practice</span></button>
          <button className="nav">◉ <span>Progress</span></button>
        </nav>
        <div className="side-note">
          <span>🚀</span>
          <b>Study smarter</b>
          <p>Turn your available time into a focused study session.</p>
        </div>
      </aside>

      <main>
        <header>
          <div>
            <p className="eyebrow">YOUR AI STUDY PARTNER</p>
            <h1>What are we learning today?</h1>
            <p className="sub">Build a focused plan, ask questions, and get unstuck whenever you need.</p>
          </div>
          <div className="avatar">S</div>
        </header>

        <section className="stats">
          <div><span>🔥</span><div><b>{progress.streak}</b><small>Day streak</small></div></div>
          <div><span>⏱</span><div><b>{progress.minutes}m</b><small>Study time</small></div></div>
          <div><span>🎯</span><div><b>{progress.questions}</b><small>Questions</small></div></div>
          <div><span>📚</span><div><b>{progress.sessions}</b><small>Sessions</small></div></div>
        </section>

        <section className="grid">
          <div className="card planner">
            <div className="card-head"><div><h2>Start a study session</h2><p>Tell StudyPilot what you need.</p></div><span className="spark">✦</span></div>
            <label>Subject</label>
            <input value={subject} onChange={e=>setSubject(e.target.value)} />
            <label>Topic</label>
            <input value={topic} onChange={e=>setTopic(e.target.value)} />
            <div className="row">
              <div><label>Goal</label><select value={goal} onChange={e=>setGoal(e.target.value)}><option>Learn</option><option>Revise</option><option>Practice</option><option>Exam Prep</option></select></div>
              <div><label>Time</label><select value={minutes} onChange={e=>setMinutes(e.target.value)}><option value="25">25 min</option><option value="45">45 min</option><option value="60">60 min</option><option value="90">90 min</option></select></div>
            </div>
            <button className="primary" onClick={generatePlan} disabled={loading}>{loading ? "Building your plan..." : "✦ Generate my plan"}</button>
          </div>

          <div className="card plan">
            {!plan ? <div className="empty"><div>🗺️</div><h2>Your personalized plan</h2><p>Fill in your session details and I'll turn them into clear steps.</p></div> :
            <><div className="card-head"><div><p className="eyebrow">YOUR PLAN</p><h2>{plan.title}</h2><p>{plan.summary}</p></div><span className="ready">READY</span></div>
            <div className="steps">{plan.steps.map((s,i)=><div className="step" key={i}><span>{i+1}</span><div><b>{s.title}</b><small>{s.time} · {s.detail}</small></div></div>)}</div>
            <div className="next"><b>Next up</b><span>{plan.next_action}</span></div></>}
          </div>
        </section>

        <section className="lower">
          <div className="card coach">
            <div className="card-head"><div><h2>Study Coach</h2><p>Ask anything about your current topic.</p></div><span className="online">● Online</span></div>
            <div className="chat">{chat.map((m,i)=><div key={i} className={`bubble ${m.who}`}>{m.text}</div>)}</div>
            <div className="composer"><input value={message} onChange={e=>setMessage(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask StudyPilot..." /><button onClick={()=>send()}>➤</button></div>
          </div>

          <div className="card stuck">
            <p className="eyebrow">THE DELIGHTFUL DETAIL</p>
            <h2>🆘 I'm Stuck</h2>
            <p className="sub">Don't know what kind of help you need? Pick the one that feels right.</p>
            <div className="stuck-grid">{stuckOptions.map(([icon,text])=><button key={text} onClick={()=>send(text)}><span>{icon}</span>{text}<b>→</b></button>)}</div>
          </div>
        </section>

        <footer>StudyPilot AI · Built for the AWS Weekend Challenge · <b>#agents</b></footer>
      </main>
    </div>
  );
}

export default App;
