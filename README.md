<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>README – QR Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --primary: #6366f1;
      --primary-dark: #4f46e5;
      --primary-light: #eef2ff;
      --bg: #08091a;
      --bg2: #0d0f26;
      --bg3: #141630;
      --card: #10122a;
      --border: #1e2248;
      --text: #dde1ff;
      --muted: #7b82c4;
      --green: #22c55e;
      --indigo: #818cf8;
      --radius: 14px;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.7;
      min-height: 100vh;
    }

    /* ── Hero ── */
    .hero {
      background: linear-gradient(160deg, #090b24 0%, #08091a 50%, #0d0e22 100%);
      border-bottom: 1px solid var(--border);
      padding: 72px 24px 56px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(ellipse 55% 45% at 50% 0%, rgba(99,102,241,.22), transparent);
      pointer-events: none;
    }

    .badge-row {
      display: flex; flex-wrap: wrap; gap: 10px;
      justify-content: center; margin-bottom: 28px;
    }
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--bg3); border: 1px solid var(--border);
      border-radius: 999px; padding: 5px 14px;
      font-size: 12px; font-weight: 600; color: var(--muted);
      letter-spacing: .4px;
    }
    .badge.green  { border-color: #22c55e33; color: var(--green); }
    .badge.indigo { border-color: #6366f155; color: var(--indigo); }
    .badge.amber  { border-color: #f59e0b44; color: #fbbf24; }

    .hero-icon {
      width: 76px; height: 76px; border-radius: 20px; margin: 0 auto 20px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex; align-items: center; justify-content: center;
      font-size: 36px;
      box-shadow: 0 16px 48px rgba(99,102,241,.45);
    }
    h1 {
      font-size: clamp(2rem, 5vw, 3.2rem);
      font-weight: 800; letter-spacing: -1px;
      background: linear-gradient(135deg, #ffffff 30%, #a5b4fc);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      margin-bottom: 14px;
    }
    .hero-sub {
      font-size: 1.05rem; color: var(--muted); max-width: 560px;
      margin: 0 auto 32px;
    }
    .hero-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 26px; border-radius: 10px; font-weight: 600;
      font-size: 14px; text-decoration: none; transition: all .2s;
      border: none; cursor: pointer;
    }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #818cf8);
      color: #fff;
      box-shadow: 0 4px 20px rgba(99,102,241,.4);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,.55); }
    .btn-outline {
      background: transparent; color: var(--text);
      border: 1px solid var(--border);
    }
    .btn-outline:hover { background: var(--bg3); border-color: #6366f188; }

    /* ── Container ── */
    .container { max-width: 900px; margin: 0 auto; padding: 60px 24px; }

    /* ── Section titles ── */
    .section-title {
      font-size: 1.05rem; font-weight: 700; color: var(--muted);
      text-transform: uppercase; letter-spacing: 1.5px;
      display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
    }
    .section-title::after {
      content: ''; flex: 1; height: 1px; background: var(--border);
    }

    /* ── 2-col feature list ── */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px; margin-bottom: 48px;
    }
    .feat-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      transition: border-color .2s, transform .2s;
    }
    .feat-card:hover { border-color: #6366f166; transform: translateY(-3px); }
    .feat-icon { font-size: 26px; margin-bottom: 10px; }
    .feat-name { font-weight: 700; font-size: .95rem; margin-bottom: 4px; }
    .feat-desc { font-size: .82rem; color: var(--muted); line-height: 1.5; }

    /* ── QR types ── */
    .types-row {
      display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 48px;
    }
    .type-chip {
      background: var(--bg3); border: 1px solid var(--border);
      border-radius: 8px; padding: 8px 16px; font-size: .85rem;
      font-weight: 600; color: var(--indigo);
      display: flex; align-items: center; gap: 6px;
    }

    /* ── Tech stack ── */
    .tech-grid {
      display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 48px;
    }
    .tech-pill {
      background: var(--bg3); border: 1px solid var(--border);
      border-radius: 8px; padding: 8px 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: .8rem; color: #a5b4fc;
      display: flex; align-items: center; gap: 6px;
    }

    /* ── Privacy banner ── */
    .privacy-banner {
      background: linear-gradient(135deg, #0d1a0d, #0f2010);
      border: 1px solid #22c55e33;
      border-radius: var(--radius); padding: 24px 28px;
      display: flex; gap: 16px; align-items: flex-start;
      margin-bottom: 48px;
    }
    .privacy-icon { font-size: 28px; flex-shrink: 0; }
    .privacy-title { font-weight: 700; color: var(--green); margin-bottom: 4px; }
    .privacy-text { font-size: .88rem; color: #86efac; line-height: 1.6; }

    /* ── Project info ── */
    .info-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
      margin-bottom: 48px;
    }
    @media (max-width: 500px) { .info-grid { grid-template-columns: 1fr; } }

    .info-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 18px 20px;
    }
    .info-label { font-size: .72rem; font-weight: 700; color: var(--muted);
      text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
    .info-value { font-weight: 600; font-size: .9rem; color: var(--text); }
    .info-value a { color: var(--indigo); text-decoration: none; }
    .info-value a:hover { text-decoration: underline; }

    /* ── Note box ── */
    .note-box {
      background: var(--bg3); border: 1px solid var(--border);
      border-left: 3px solid var(--primary);
      border-radius: var(--radius); padding: 18px 20px;
      font-size: .875rem; color: var(--muted); margin-bottom: 48px;
      line-height: 1.6;
    }
    .note-box strong { color: var(--text); }

    /* ── Footer ── */
    footer {
      text-align: center; padding: 32px 24px;
      border-top: 1px solid var(--border);
      color: var(--muted); font-size: .82rem;
    }
    footer a { color: var(--indigo); text-decoration: none; }
    footer a:hover { text-decoration: underline; }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  </style>
</head>
<body>

<!-- ═══════════ HERO ═══════════ -->
<section class="hero">
  <div class="badge-row">
    <span class="badge green">✦ Day 2 of 30</span>
    <span class="badge indigo">📷 Camera + Upload</span>
    <span class="badge amber">⚡ Offline Ready</span>
    <span class="badge">🌐 Vanilla JS</span>
  </div>
  <div class="hero-icon">⬛</div>
  <h1>QR Studio</h1>
  <p class="hero-sub">
    Generate beautifully customized QR codes and scan them in real-time via camera or image upload —
    all running entirely in your browser with no server needed.
  </p>
  <div class="hero-btns">
    <a class="btn btn-primary" href="https://qrcode-generator-30in30.vercel.app/" target="_blank" rel="noopener">
      🚀 Live Demo
    </a>
    <a class="btn btn-outline" href="https://github.com/Granth2006" target="_blank" rel="noopener">
      ⭐ GitHub
    </a>
  </div>
</section>

<!-- ═══════════ BODY ═══════════ -->
<div class="container">

  <!-- Generator Features -->
  <p class="section-title">✨ Generator Features</p>
  <div class="features-grid">
    <div class="feat-card">
      <div class="feat-icon">🎨</div>
      <div class="feat-name">Custom Colors</div>
      <div class="feat-desc">Pick any foreground and background color for your QR code via a color picker.</div>
    </div>
    <div class="feat-card">
      <div class="feat-icon">📐</div>
      <div class="feat-name">Adjustable Size</div>
      <div class="feat-desc">Use the range slider to generate QR codes from 128 px up to 512 px.</div>
    </div>
    <div class="feat-card">
      <div class="feat-icon">🛡️</div>
      <div class="feat-name">Error Correction</div>
      <div class="feat-desc">Choose L / M / Q / H correction levels to control damage resilience.</div>
    </div>
    <div class="feat-card">
      <div class="feat-icon">⬇️</div>
      <div class="feat-name">Export as PNG / SVG</div>
      <div class="feat-desc">Download your QR code as a pixel-perfect PNG or a scalable SVG file.</div>
    </div>
    <div class="feat-card">
      <div class="feat-icon">📋</div>
      <div class="feat-name">Copy to Clipboard</div>
      <div class="feat-desc">Copy the generated QR image directly to your clipboard with one click.</div>
    </div>
    <div class="feat-card">
      <div class="feat-icon">🔍</div>
      <div class="feat-name">Auto-Detect Type</div>
      <div class="feat-desc">As you type, the app detects if your input is a URL, email, phone or text.</div>
    </div>
  </div>

  <!-- Supported QR Types -->
  <p class="section-title">📦 Supported QR Types</p>
  <div class="types-row">
    <div class="type-chip">📝 Plain Text</div>
    <div class="type-chip">🔗 URL</div>
    <div class="type-chip">✉️ Email (with subject & body)</div>
    <div class="type-chip">📞 Phone Number</div>
    <div class="type-chip">📶 WiFi Credentials</div>
  </div>

  <!-- Scanner Features -->
  <p class="section-title">📷 Scanner Features</p>
  <div class="features-grid">
    <div class="feat-card">
      <div class="feat-icon">📹</div>
      <div class="feat-name">Live Camera Scan</div>
      <div class="feat-desc">Point your camera at any QR code for real-time scanning with a visual overlay.</div>
    </div>
    <div class="feat-card">
      <div class="feat-icon">🖼️</div>
      <div class="feat-name">Upload Image</div>
      <div class="feat-desc">Drag & drop or browse to upload a QR code image (PNG, JPG, WebP, GIF).</div>
    </div>
    <div class="feat-card">
      <div class="feat-icon">🏷️</div>
      <div class="feat-name">Smart Result Parsing</div>
      <div class="feat-desc">Detects QR type (URL, Email, Phone, WiFi, Text) and shows relevant actions.</div>
    </div>
    <div class="feat-card">
      <div class="feat-icon">🕒</div>
      <div class="feat-name">Scan History</div>
      <div class="feat-desc">All scanned results are saved to localStorage so you can revisit them anytime.</div>
    </div>
  </div>

  <!-- Privacy note -->
  <div class="privacy-banner">
    <div class="privacy-icon">🔒</div>
    <div>
      <div class="privacy-title">Fully Offline — No Data Leaves Your Browser</div>
      <div class="privacy-text">
        QR generation and scanning both run entirely client-side using locally bundled libraries.
        No QR data, camera frames, or images are ever sent to any server.
      </div>
    </div>
  </div>

  <!-- Note about camera -->
  <div class="note-box">
    <strong>📌 Camera Note:</strong> Live camera scanning requires a <strong>secure context</strong>
    (HTTPS or localhost). If the app is opened via <code>file://</code>, camera access is blocked by
    the browser — use the <strong>Upload Image</strong> mode instead, which works everywhere.
  </div>

  <!-- Tech Stack -->
  <p class="section-title">🧰 Tech Stack</p>
  <div class="tech-grid">
    <div class="tech-pill">📄 HTML5</div>
    <div class="tech-pill">🎨 Vanilla CSS</div>
    <div class="tech-pill">⚡ Vanilla JavaScript</div>
    <div class="tech-pill">📦 qrcode (npm, bundled)</div>
    <div class="tech-pill">🔍 jsQR (local)</div>
    <div class="tech-pill">🌐 Vercel (hosting)</div>
  </div>

  <!-- Project Info -->
  <p class="section-title">📋 Project Info</p>
  <div class="info-grid">
    <div class="info-card">
      <div class="info-label">Challenge</div>
      <div class="info-value">30 Web Apps in 30 Days</div>
    </div>
    <div class="info-card">
      <div class="info-label">Day</div>
      <div class="info-value">Day 2 / 30</div>
    </div>
    <div class="info-card">
      <div class="info-label">Author</div>
      <div class="info-value">Granth Kumar</div>
    </div>
    <div class="info-card">
      <div class="info-label">Live URL</div>
      <div class="info-value">
        <a href="https://qrcode-generator-30in30.vercel.app/" target="_blank" rel="noopener">
          qrcode-generator-30in30.vercel.app ↗
        </a>
      </div>
    </div>
    <div class="info-card">
      <div class="info-label">Build</div>
      <div class="info-value">No build step — pure HTML/CSS/JS</div>
    </div>
    <div class="info-card">
      <div class="info-label">License</div>
      <div class="info-value">MIT</div>
    </div>
  </div>

</div>

<!-- ═══════════ FOOTER ═══════════ -->
<footer>
  <p>
    Built by <a href="https://github.com/Granth2006" target="_blank" rel="noopener">Granth Kumar</a>
    &nbsp;·&nbsp; Part of the <strong>30 Web Apps in 30 Days</strong> challenge
    &nbsp;·&nbsp;
    <a href="https://qrcode-generator-30in30.vercel.app/" target="_blank" rel="noopener">🚀 Live Demo</a>
  </p>
</footer>

</body>
</html>
