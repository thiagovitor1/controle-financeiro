"use client";

import BottomNav from "../layout/BottomNav";

export default function PageShell({ title, subtitle, children }) {
  return (
    <main className="pageRoot">
      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body {
          margin: 0;
          padding: 0;
          background: radial-gradient(circle at top, #2a1458 0%, #170c36 38%, #0d0820 100%);
          color: #f7f5ff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow-x: hidden;
        }
        a { color: inherit; text-decoration: none; }
        .pageRoot { min-height: 100vh; padding: 12px 12px 24px; }
        .container { max-width: 760px; margin: 0 auto; display: grid; gap: 14px; }
        .topBar {
          min-height: 40px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(245,240,255,0.9);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(10px);
        }
        .hero {
          background: linear-gradient(180deg, rgba(31,17,66,0.92) 0%, rgba(21,12,46,0.96) 100%);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          padding: 16px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.03);
        }
        .title {
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.1;
        }
        .subtitle {
          margin: 8px 0 0 0;
          color: rgba(224,216,245,0.72);
          font-size: 13px;
          line-height: 1.45;
        }
        .card {
          background: linear-gradient(180deg, rgba(31,17,66,0.92) 0%, rgba(21,12,46,0.96) 100%);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          padding: 16px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.03);
        }
        .sectionTitle {
          margin: 0 0 10px 0;
          font-size: 15px;
          font-weight: 700;
          color: rgba(248,245,255,0.96);
        }
        .muted {
          color: rgba(224,216,245,0.66);
          font-size: 12px;
        }
        .grid2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .grid1 {
          display: grid;
          gap: 10px;
        }
        .stat {
          border-radius: 18px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .statLabel {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: rgba(224,216,245,0.6);
          margin-bottom: 6px;
        }
        .statValue {
          font-size: 18px;
          font-weight: 800;
          line-height: 1.1;
        }
        .bottomNav {
          position: sticky;
          bottom: 10px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
          padding: 8px;
          border-radius: 20px;
          background: rgba(12,8,28,0.88);
          border: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          box-shadow: 0 16px 34px rgba(0,0,0,0.22);
        }
        .navItem {
          text-align: center;
          color: rgba(242,239,255,0.82);
          font-weight: 700;
          font-size: 12px;
          padding: 10px 4px;
          border-radius: 14px;
        }
        .navItem.active { background: rgba(130,92,255,0.18); }
        .listItem {
          border-radius: 18px;
          padding: 12px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .listTitle {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .rowBetween {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }
      `}</style>

      <div className="container">
        <div className="topBar">Controle Financeiro</div>
        <section className="hero">
          <h1 className="title">{title}</h1>
          <p className="subtitle">{subtitle}</p>
        </section>
        {children}
        <BottomNav />
      </div>
    </main>
  );
}
