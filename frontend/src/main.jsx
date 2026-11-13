import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  const [ingredients, setIngredients] = useState("Aspartame, Sodium Nitrite, Vitamin C");
  const [category, setCategory] = useState("Packaged food");
  const [country, setCountry] = useState("India");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyse(e) {
    e.preventDefault();
    if (!ingredients.trim()) return;
    setLoading(true); setError(""); setResults(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/analyse", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, product_category: category, country })
      });
      if (!response.ok) throw new Error("The analysis service returned an error.");
      setResults(await response.json());
    } catch {
      setError("Could not connect to the backend. Make sure the Python API is running in the other terminal.");
    } finally { setLoading(false); }
  }

  return <div className="app">
    <header className="topbar"><a className="brand" href="#"><span className="brandmark">C</span> CLEARCHECK</a><span className="topnote">INGREDIENT INTELLIGENCE</span></header>
    <main>
      <section className="hero">
        <div className="eyebrow"><span></span> INFORMED CHOICES START HERE</div>
        <h1>Know what goes<br/><em>into your products.</em></h1>
        <p className="intro">Explore ingredient information, scientific context and regulatory considerations — in one clear place.</p>
      </section>
      <section className="workspace">
        <div className="section-head"><div><div className="eyebrow">01 / PRODUCT REVIEW</div><h2>Analyse ingredients</h2></div><span className="tag">DEMO PROTOTYPE</span></div>
        <form onSubmit={analyse}>
          <label htmlFor="ingredients">Ingredient list</label>
          <textarea id="ingredients" value={ingredients} onChange={e=>setIngredients(e.target.value)} placeholder="Enter ingredients separated by commas..." />
          <div className="fields">
            <div><label htmlFor="category">Product category</label><select id="category" value={category} onChange={e=>setCategory(e.target.value)}><option>Packaged food</option><option>Beverage</option><option>Skincare</option><option>Personal care</option><option>Supplement</option><option>Not specified</option></select></div>
            <div><label htmlFor="country">Regulatory region</label><select id="country" value={country} onChange={e=>setCountry(e.target.value)}><option>India</option><option>United States</option><option>European Union</option></select></div>
          </div>
          <button disabled={loading}>{loading ? "Reviewing ingredients..." : "Review ingredients"} <span>→</span></button>
        </form>
        {error && <p className="error">{error}</p>}
      </section>
      {results && <section className="results">
        <div className="section-head"><div><div className="eyebrow">02 / ANALYSIS SUMMARY</div><h2>Ingredient review</h2></div><span className="tag">{results.results.length} ITEMS</span></div>
        <div className="regulatory-note">
  <b>REGULATORY SCOPE</b>
  <p>
    Selected region: {results.country}. Country-specific legal status
    has not been independently verified in this demonstration.
  </p>
</div>
        <div className="agentline">
  <b>ANALYSIS WORKFLOW · DEMONSTRATION</b>
  {results.agents.map((a, i) => (
    <span key={a}>{String(i + 1).padStart(2, "0")} / {a}</span>
  ))}
</div>
        {results.results.map((r,i)=><article className="result-card" key={i}>
          <div className="result-top"><h3>{r.ingredient}</h3><span className={r.status.startsWith("No entry")?"unknown":"matched"}>{r.status}</span></div>
          <div className="category">{r.category}</div><p>{r.note}</p><div className="evidence"><b>Evidence context</b><p>{r.evidence}</p></div><div className="caution"><b>Important context</b><p>{r.caution}</p></div>
        </article>)}
        <p className="disclaimer">{results.disclaimer}</p>
      </section>}
      <section className="principles"><div className="eyebrow">OUR APPROACH</div><div className="principle-grid"><div><b>Evidence first</b><p>Separate documented evidence from assumptions.</p></div><div><b>Context matters</b><p>Consider product category, jurisdiction and exposure.</p></div><div><b>Clarity over alarm</b><p>Explain uncertainty without overstating risk.</p></div></div></section>
    </main>
    <footer><span>CLEARCHECK</span><span>Educational project · Not a medical or regulatory authority</span></footer>
  </div>;
}
createRoot(document.getElementById("root")).render(<App />);
