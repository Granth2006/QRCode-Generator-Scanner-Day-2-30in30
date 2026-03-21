<div align="center">

<img src="https://img.shields.io/badge/Day-2%20%2F%2030-6366f1?style=for-the-badge&logo=calendar&logoColor=white" />
<img src="https://img.shields.io/badge/Offline-Ready-22c55e?style=for-the-badge&logo=javascript&logoColor=white" />
<img src="https://img.shields.io/badge/Camera%20%2B%20Upload-Scan-818cf8?style=for-the-badge&logo=camera&logoColor=white" />
<img src="https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white" />

<br /><br />

# ⬛ QR Studio

### Generate customized QR codes & scan them in real-time —<br/>camera or image upload, all running locally in your browser.

<br/>

[![🚀 Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-qrcode--generator--30in30.vercel.app-6366f1?style=for-the-badge)](https://qrcode-generator-30in30.vercel.app/)
&nbsp;&nbsp;
[![GitHub](https://img.shields.io/badge/⭐%20GitHub-Granth2006-24292e?style=for-the-badge&logo=github)](https://github.com/Granth2006)

</div>

---

## ✨ Generator Features

<table>
  <tr>
    <td width="50%">
      <h3>🎨 Custom Colors</h3>
      Pick any foreground and background color via a color picker to match your brand.
    </td>
    <td width="50%">
      <h3>📐 Adjustable Size</h3>
      Slider from 128 px up to 512 px — generates at any resolution you need.
    </td>
  </tr>
  <tr>
    <td>
      <h3>🛡️ Error Correction</h3>
      Choose L / M / Q / H correction levels to control damage resilience of the code.
    </td>
    <td>
      <h3>⬇️ Export PNG & SVG</h3>
      Download as a pixel-perfect PNG or an infinitely scalable SVG vector file.
    </td>
  </tr>
  <tr>
    <td>
      <h3>📋 Copy to Clipboard</h3>
      Copy the QR code image directly to your clipboard with a single click.
    </td>
    <td>
      <h3>🔍 Auto-Detect Type</h3>
      As you type, the app identifies URLs, emails, phone numbers and plain text.
    </td>
  </tr>
</table>

---

## 📦 Supported QR Content Types

| Type | Format |
|---|---|
| 📝 Plain Text | Any string |
| 🔗 URL | `https://…` or `www.…` |
| ✉️ Email | `mailto:…` with subject & body |
| 📞 Phone | `tel:…` |
| 📶 WiFi | SSID + password + encryption type |

---

## 📷 Scanner Features

<table>
  <tr>
    <td width="50%">
      <h3>📹 Live Camera Scan</h3>
      Real-time scanning via webcam / phone camera with animated frame overlay and auto-detect.
    </td>
    <td width="50%">
      <h3>🖼️ Upload Image</h3>
      Drag & drop or browse PNG / JPG / WebP / GIF. Works offline, no camera needed.
    </td>
  </tr>
  <tr>
    <td>
      <h3>🏷️ Smart Result Parsing</h3>
      Detects QR content type and shows relevant actions (Open Link, Copy, etc.).
    </td>
    <td>
      <h3>🕒 History</h3>
      Generated & scanned QR codes are saved to <code>localStorage</code> for quick access.
    </td>
  </tr>
</table>

---

## 🔐 Privacy First

> **No data ever leaves your browser.**
> QR generation and scanning both run client-side using locally bundled libraries.
> No QR data, camera frames, or images are sent to any server.

> **📌 Camera Note:** Live camera requires a secure context (HTTPS or localhost).
> If opening via `file://`, use **Upload Image** mode instead — it works everywhere.

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) | Structure & markup |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) | Styling — vanilla, no frameworks |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | All logic, client-side only |
| `qrcode` (npm, locally bundled) | QR code generation via canvas & SVG |
| `jsQR` (local) | QR code decoding from image data |
| ![Vercel](https://img.shields.io/badge/Vercel-000?style=flat&logo=vercel&logoColor=white) | Hosting & deployment |

---

## 📋 Project Info

| | |
|---|---|
| 🏆 **Challenge** | 30 Web Apps in 30 Days |
| 📅 **Day** | Day 2 / 30 |
| 👤 **Author** | Granth Kumar |
| 🌐 **Live URL** | [qrcode-generator-30in30.vercel.app](https://qrcode-generator-30in30.vercel.app/) |
| 🛠️ **Build** | No build step — pure HTML / CSS / JS |
| 📄 **License** | MIT |

---

<details>
<summary>📁 File Structure</summary>

```
2/
├── index.html          # Full app — generate & scan tabs, history
├── script.js           # All QR logic (generate, scan, history)
├── style.css           # Complete styling & dark/light theme
├── qrcode.bundle.js    # Locally bundled qrcode library (npm → esbuild)
└── jsQR.js             # Local QR scanner library
```

</details>

---

<div align="center">

Built by **[Granth Kumar](https://github.com/Granth2006)** &nbsp;·&nbsp; Part of the **30 Web Apps in 30 Days** challenge

[![Live Demo](https://img.shields.io/badge/🚀%20Open%20Live%20Demo-6366f1?style=for-the-badge)](https://qrcode-generator-30in30.vercel.app/)

</div>
