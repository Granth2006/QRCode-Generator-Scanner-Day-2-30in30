/**
 * QR Studio – script.js
 * Full QR Code Generator + Scanner application
 * Vanilla JS, no frameworks, modular & well-commented
 */

'use strict';

/* =====================================================
   CONSTANTS & STATE
===================================================== */
const APP_STATE = {
  currentTab:    'generate',
  currentType:   'text',        // text | url | email | phone | wifi
  qrText:        '',
  qrOptions: {
    fg:    '#6366f1',
    bg:    '#ffffff',
    size:  256,
    errorCorrectionLevel: 'M',
  },
  cameraStream:  null,
  isScanning:    false,
  scanRAF:       null,
};

// localStorage keys
const LS_KEYS = {
  theme:      'qrstudio_theme',
  genHistory: 'qrstudio_gen_history',
  scanHistory:'qrstudio_scan_history',
};

/* =====================================================
   DOM ELEMENTS
===================================================== */
const $ = id => document.getElementById(id);

// Header
const themeToggle        = $('theme-toggle');

// Tabs
const mainTabs           = document.querySelectorAll('.main-tab');
const tabPanels          = document.querySelectorAll('.tab-panel');
const tabIndicator       = document.querySelector('.tab-indicator');

// Generate
const typeSelector       = $('type-selector');
const typeBtns           = document.querySelectorAll('.type-btn');
const inputSimple        = $('input-simple');
const inputEmail         = $('input-email');
const inputWifi          = $('input-wifi');
const qrInputLabel       = $('qr-input-label');
const qrInput            = $('qr-input');
const emailTo            = $('email-to');
const emailSubject       = $('email-subject');
const emailBody          = $('email-body');
const wifiSsid           = $('wifi-ssid');
const wifiPassword       = $('wifi-password');
const wifiEnc            = $('wifi-enc');
const wifiHidden         = $('wifi-hidden');
const pwToggle           = $('pw-toggle');
const qrFg               = $('qr-fg');
const qrBg               = $('qr-bg');
const fgPreview          = $('fg-preview');
const bgPreview          = $('bg-preview');
const qrSize             = $('qr-size');
const sizeValue          = $('size-value');
const qrError            = $('qr-error');
const qrPlaceholder      = $('qr-placeholder');
const qrCanvas           = $('qr-canvas');
const detectedType       = $('detected-type');
const btnCopyImg         = $('btn-copy-img');
const btnDlPng           = $('btn-dl-png');
const btnDlSvg           = $('btn-dl-svg');
const btnClear           = $('btn-clear');

// Scan
const scanModeToggle     = $('scan-mode-toggle');
const scanModeBtns       = document.querySelectorAll('.scan-mode-btn');
const cameraView         = $('camera-view');
const uploadView         = $('upload-view');
const qrVideo            = $('qr-video');
const scanCanvas         = $('scan-canvas');
const scanFrame          = $('scan-frame');
const scanLine           = $('scan-line');
const cameraStatus       = $('camera-status');
const statusDot          = $('status-dot');
const statusText         = $('status-text');
const btnStartCamera     = $('btn-start-camera');
const btnStopCamera      = $('btn-stop-camera');
const dropZone           = $('drop-zone');
const fileInput          = $('file-input');
const browseBtn          = $('browse-btn');
const dropContent        = $('drop-content');
const uploadPreviewImg   = $('upload-preview-img');
const resultCard         = $('result-card');
const resultEmpty        = $('result-empty');
const resultContent      = $('result-content');
const resultTypeBadge    = $('result-type-badge');
const resultText         = $('result-text');
const btnOpenLink        = $('btn-open-link');
const btnCopyResult      = $('btn-copy-result');
const btnClearResult     = $('btn-clear-result');
const scanSuccessAnim    = $('scan-success-anim');

// History
const genHistoryList     = $('gen-history-list');
const scanHistoryList    = $('scan-history-list');
const genHistoryEmpty    = $('gen-history-empty');
const scanHistoryEmpty   = $('scan-history-empty');
const btnClearGenHistory  = $('btn-clear-gen-history');
const btnClearScanHistory = $('btn-clear-scan-history');

// Toast
const toastContainer     = $('toast-container');


/* =====================================================
   THEME
===================================================== */
/** Initialize theme from localStorage or system preference */
function initTheme() {
  const saved = localStorage.getItem(LS_KEYS.theme);
  const pref  = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const theme = saved || pref;
  document.documentElement.setAttribute('data-theme', theme);
}

/** Toggle dark/light mode */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(LS_KEYS.theme, next);
}

themeToggle.addEventListener('click', toggleTheme);


/* =====================================================
   TABS
===================================================== */
/** Switch the tab indicator position to match the active tab button */
function updateTabIndicator(activeBtn) {
  const wrap        = document.querySelector('.main-tabs');
  const wrapRect    = wrap.getBoundingClientRect();
  const btnRect     = activeBtn.getBoundingClientRect();
  tabIndicator.style.left  = (btnRect.left - wrapRect.left - 5) + 'px';
  tabIndicator.style.width = btnRect.width + 'px';
}

/** Activate a tab by name */
function activateTab(tabName) {
  APP_STATE.currentTab = tabName;

  mainTabs.forEach(btn => {
    const isActive = btn.dataset.tab === tabName;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
    if (isActive) updateTabIndicator(btn);
  });

  tabPanels.forEach(panel => {
    const isActive = panel.id === `tab-${tabName}`;
    panel.classList.toggle('active', isActive);
  });

  // Stop camera when leaving scan tab
  if (tabName !== 'scan' && APP_STATE.cameraStream) {
    stopCamera();
  }

  // Refresh history when switching to it
  if (tabName === 'history') {
    renderHistory();
  }
}

mainTabs.forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.dataset.tab));
});

// Initialize indicator on first load
window.addEventListener('load', () => {
  const activeTab = document.querySelector('.main-tab.active');
  if (activeTab) updateTabIndicator(activeTab);
});


/* =====================================================
   QR CODE GENERATOR
===================================================== */

/* ── Type switcher ── */
function setType(type) {
  APP_STATE.currentType = type;

  typeBtns.forEach(b => b.classList.toggle('active', b.dataset.type === type));

  // Show correct input panel
  inputSimple.classList.add('hidden');
  inputEmail.classList.add('hidden');
  inputWifi.classList.add('hidden');

  if (type === 'email') {
    inputEmail.classList.remove('hidden');
  } else if (type === 'wifi') {
    inputWifi.classList.remove('hidden');
  } else {
    inputSimple.classList.remove('hidden');
    // Update label and placeholder
    const labels = { text: 'Enter Text', url: 'Enter URL', phone: 'Enter Phone Number' };
    const placeholders = {
      text:  'Type anything here…',
      url:   'https://example.com',
      phone: '+1 234 567 8900',
    };
    qrInputLabel.textContent   = labels[type] || 'Enter Text';
    qrInput.placeholder        = placeholders[type] || 'Type here…';
  }

  generateQR();
}

typeSelector.addEventListener('click', e => {
  const btn = e.target.closest('.type-btn');
  if (btn) setType(btn.dataset.type);
});

/* ── Build QR string from current inputs ── */
function buildQrString() {
  const t = APP_STATE.currentType;

  if (t === 'email') {
    const to  = emailTo.value.trim();
    if (!to) return '';
    let s = `mailto:${to}`;
    const params = [];
    if (emailSubject.value.trim()) params.push(`subject=${encodeURIComponent(emailSubject.value.trim())}`);
    if (emailBody.value.trim())    params.push(`body=${encodeURIComponent(emailBody.value.trim())}`);
    if (params.length) s += '?' + params.join('&');
    return s;
  }

  if (t === 'wifi') {
    const ssid = wifiSsid.value.trim();
    if (!ssid) return '';
    const pass = wifiPassword.value;
    const enc  = wifiEnc.value;
    const hid  = wifiHidden.checked ? 'true' : 'false';
    return `WIFI:T:${enc};S:${ssid};P:${pass};H:${hid};;`;
  }

  return qrInput.value.trim();
}

/* ── Auto-detect content type from string ── */
function detectType(str) {
  if (!str) return null;
  if (/^(https?:\/\/|www\.)/i.test(str))          return { label: '🔗 URL',   cls: 'url'   };
  if (/^mailto:/i.test(str))                        return { label: '✉️ Email', cls: 'email' };
  if (/^tel:/i.test(str))                           return { label: '📞 Phone', cls: 'phone' };
  if (/^WIFI:/i.test(str))                          return { label: '📶 WiFi',  cls: 'wifi'  };
  if (/^[\w.+-]+@[\w-]+\.[a-z]{2,}$/i.test(str))   return { label: '✉️ Email', cls: 'email' };
  if (/^\+?[\d\s\-().]{7,}$/.test(str))            return { label: '📞 Phone', cls: 'phone' };
  return { label: '📝 Text', cls: 'text' };
}

/* ── Generate QR Code ── */
let genDebounce = null;

function generateQR() {
  clearTimeout(genDebounce);
  genDebounce = setTimeout(_doGenerate, 150);
}

function _doGenerate() {
  const text = buildQrString();
  APP_STATE.qrText = text;

  if (!text) {
    qrCanvas.classList.add('hidden');
    qrPlaceholder.classList.remove('hidden');
    detectedType.classList.add('hidden');
    disableExportBtns(true);
    return;
  }

  const { size, fg, bg, errorCorrectionLevel } = APP_STATE.qrOptions;

  QRCode.toCanvas(qrCanvas, text, {
    width:  size,
    margin: 2,
    color:  { dark: fg, light: bg },
    errorCorrectionLevel,
  }, err => {
    if (err) {
      showToast('QR generation failed: ' + err.message, 'error');
      return;
    }

    // Show canvas, hide placeholder
    qrCanvas.classList.remove('hidden');
    qrPlaceholder.classList.add('hidden');

    // Trigger appear animation
    qrCanvas.classList.remove('appear');
    void qrCanvas.offsetWidth; // reflow
    qrCanvas.classList.add('appear');

    // Show auto-detected type
    if (APP_STATE.currentType === 'text') {
      const detected = detectType(text);
      if (detected) {
        detectedType.textContent = detected.label;
        detectedType.className   = 'detected-badge';
        detectedType.classList.remove('hidden');
      } else {
        detectedType.classList.add('hidden');
      }
    } else {
      detectedType.classList.add('hidden');
    }

    disableExportBtns(false);
    saveToGenHistory(text);
  });
}

function disableExportBtns(disabled) {
  btnCopyImg.disabled = disabled;
  btnDlPng.disabled   = disabled;
  btnDlSvg.disabled   = disabled;
}

/* ── Color pickers ── */
qrFg.addEventListener('input', () => {
  APP_STATE.qrOptions.fg = qrFg.value;
  fgPreview.style.background = qrFg.value;
  generateQR();
});
qrBg.addEventListener('input', () => {
  APP_STATE.qrOptions.bg = qrBg.value;
  bgPreview.style.background = qrBg.value;
  generateQR();
});

/* ── Size slider ── */
qrSize.addEventListener('input', () => {
  const val = parseInt(qrSize.value);
  APP_STATE.qrOptions.size = val;
  sizeValue.textContent = val + ' px';
  // Update slider fill
  const pct = ((val - 128) / (512 - 128)) * 100;
  qrSize.style.setProperty('--pct', pct + '%');
  generateQR();
});

/* ── Error correction level ── */
qrError.addEventListener('change', () => {
  APP_STATE.qrOptions.errorCorrectionLevel = qrError.value;
  generateQR();
});

/* ── Input listeners ── */
qrInput.addEventListener('input', generateQR);
emailTo.addEventListener('input', generateQR);
emailSubject.addEventListener('input', generateQR);
emailBody.addEventListener('input', generateQR);
wifiSsid.addEventListener('input', generateQR);
wifiPassword.addEventListener('input', generateQR);
wifiEnc.addEventListener('change', generateQR);
wifiHidden.addEventListener('change', generateQR);

/* ── Toggle wifi password visibility ── */
pwToggle.addEventListener('click', () => {
  const isPass = wifiPassword.type === 'password';
  wifiPassword.type = isPass ? 'text' : 'password';
  pwToggle.innerHTML = isPass
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
});

/* ── Clear ── */
btnClear.addEventListener('click', () => {
  qrInput.value       = '';
  emailTo.value       = '';
  emailSubject.value  = '';
  emailBody.value     = '';
  wifiSsid.value      = '';
  wifiPassword.value  = '';
  wifiEnc.value       = 'WPA';
  wifiHidden.checked  = false;
  APP_STATE.qrText    = '';
  qrCanvas.classList.add('hidden');
  qrPlaceholder.classList.remove('hidden');
  detectedType.classList.add('hidden');
  disableExportBtns(true);
  showToast('Cleared', 'info');
});

/* ── Download PNG ── */
btnDlPng.addEventListener('click', () => {
  if (!APP_STATE.qrText) return;
  const link = document.createElement('a');
  link.download = 'qrcode.png';
  link.href = qrCanvas.toDataURL('image/png');
  link.click();
  showToast('PNG downloaded!', 'success');
});

/* ── Download SVG ── */
btnDlSvg.addEventListener('click', () => {
  if (!APP_STATE.qrText) return;
  const { size, fg, bg, errorCorrectionLevel } = APP_STATE.qrOptions;

  QRCode.toString(APP_STATE.qrText, {
    type:  'svg',
    width: size,
    margin: 2,
    color: { dark: fg, light: bg },
    errorCorrectionLevel,
  }, (err, svgStr) => {
    if (err) { showToast('SVG generation failed', 'error'); return; }
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'qrcode.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    showToast('SVG downloaded!', 'success');
  });
});

/* ── Copy QR Image ── */
btnCopyImg.addEventListener('click', async () => {
  if (!APP_STATE.qrText) return;
  try {
    const blob = await new Promise(resolve => qrCanvas.toBlob(resolve, 'image/png'));
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    showToast('QR image copied to clipboard!', 'success');
  } catch (e) {
    // Fallback: copy data URL as text
    try {
      await navigator.clipboard.writeText(qrCanvas.toDataURL());
      showToast('Image data copied (as data URL)', 'info');
    } catch {
      showToast('Copy not supported in this browser', 'error');
    }
  }
});


/* =====================================================
   QR CODE SCANNER – CAMERA
===================================================== */

/** Start device camera and begin scanning */
async function startCamera() {
  // Camera requires a secure context (HTTPS or localhost).
  // Opening via file:// will NOT have mediaDevices available.
  if (!window.isSecureContext) {
    setCameraStatus('error', 'Secure context required');
    showCameraSecureContextError();
    return;
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setCameraStatus('error', 'Camera API unavailable');
    showCameraSecureContextError();
    return;
  }

  try {
    setCameraStatus('loading', 'Requesting camera access…');

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width:      { ideal: 1280 },
        height:     { ideal: 720 },
      }
    });

    APP_STATE.cameraStream = stream;
    qrVideo.srcObject = stream;
    await qrVideo.play();

    btnStartCamera.classList.add('hidden');
    btnStopCamera.classList.remove('hidden');
    APP_STATE.isScanning = true;

    setCameraStatus('active', 'Scanning…');
    scanLoop();

  } catch (err) {
    let msg;
    if (err.name === 'NotAllowedError') {
      msg = 'Camera permission denied. Please allow access in your browser settings.';
    } else if (err.name === 'NotFoundError') {
      msg = 'No camera found on this device.';
    } else {
      msg = `Camera error: ${err.message}`;
    }
    setCameraStatus('error', 'Camera unavailable');
    showToast(msg, 'error');
    console.error('Camera error:', err);
  }
}

/** Show a friendly error when camera API is unavailable (file:// context) */
function showCameraSecureContextError() {
  const videoWrap = document.getElementById('video-wrap');
  const existing  = videoWrap.querySelector('.camera-error');
  if (existing) return; // already shown

  const el = document.createElement('div');
  el.className = 'camera-error';
  el.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <strong style="color:var(--text)">Camera requires a secure context</strong>
    <p>Opening the app via <code>file://</code> blocks camera access.<br>
    Serve the folder with a local server, e.g.:<br>
    <code style="background:var(--input-bg);padding:4px 8px;border-radius:6px;display:inline-block;margin-top:6px">npx serve .</code><br>
    then open <a href="http://localhost:3000" target="_blank" rel="noopener">http://localhost:3000</a></p>
    <p style="margin-top:8px">Meanwhile, use <strong>Upload Image</strong> to scan from a file — that works everywhere!</p>
  `;

  // Insert inside video-wrap, replacing the video
  videoWrap.style.background = 'var(--bg-3)';
  videoWrap.style.display    = 'flex';
  videoWrap.style.alignItems = 'center';
  videoWrap.style.justifyContent = 'center';
  videoWrap.appendChild(el);

  showToast('Camera needs HTTPS or localhost. Use Upload mode instead.', 'error', 5000);
}

/** Stop the camera stream */
function stopCamera() {
  APP_STATE.isScanning = false;
  if (APP_STATE.scanRAF) cancelAnimationFrame(APP_STATE.scanRAF);
  if (APP_STATE.cameraStream) {
    APP_STATE.cameraStream.getTracks().forEach(t => t.stop());
    APP_STATE.cameraStream = null;
  }
  qrVideo.srcObject = null;
  btnStartCamera.classList.remove('hidden');
  btnStopCamera.classList.add('hidden');
  setCameraStatus('idle', 'Camera stopped');

  // Clear canvas overlay
  const ctx = scanCanvas.getContext('2d');
  ctx.clearRect(0, 0, scanCanvas.width, scanCanvas.height);
}

function setCameraStatus(state, message) {
  statusText.textContent = message;
  statusDot.className    = 'status-dot';
  if (state === 'active')  statusDot.classList.add('active');
  if (state === 'error')   statusDot.classList.add('error');
  if (state === 'success') { statusDot.classList.add('success'); }
}

/** Main scanning loop using requestAnimationFrame */
function scanLoop() {
  if (!APP_STATE.isScanning) return;

  const video = qrVideo;
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    const canvas = scanCanvas;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code      = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code) {
      // Draw highlight around QR location
      drawQRHighlight(ctx, code.location);
      handleScanResult(code.data, true);
      return; // pause scanning briefly
    }
  }

  APP_STATE.scanRAF = requestAnimationFrame(scanLoop);
}

/** Draw a green polygon around detected QR region */
function drawQRHighlight(ctx, location) {
  const pts = [
    location.topLeftCorner,
    location.topRightCorner,
    location.bottomRightCorner,
    location.bottomLeftCorner,
  ];
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
  ctx.closePath();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth   = 4;
  ctx.stroke();
  ctx.fillStyle   = 'rgba(34,197,94,0.15)';
  ctx.fill();
}

btnStartCamera.addEventListener('click', startCamera);
btnStopCamera.addEventListener('click', stopCamera);


/* =====================================================
   QR CODE SCANNER – UPLOAD / DRAG & DROP
===================================================== */

/** Process an uploaded image file for QR scanning */
function processImageFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Please upload a valid image file', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    const src = e.target.result;
    // Show preview
    uploadPreviewImg.src = src;
    uploadPreviewImg.classList.remove('hidden');
    dropContent.classList.add('hidden');

    // Scan using offscreen canvas
    const img  = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = img.width;
      canvas.height = img.height;
      const ctx     = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code      = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth',
      });

      if (code) {
        handleScanResult(code.data, false);
      } else {
        showScanError();
        showToast('No QR code found in the image', 'error');
      }
    };
    img.src = src;
  };
  reader.readAsDataURL(file);
}

/** Handle drag & drop */
dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('drag-active');
});
dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-active');
});
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-active');
  const file = e.dataTransfer.files[0];
  if (file) processImageFile(file);
});

// File input
fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) processImageFile(file);
});

// Browse button click
browseBtn.addEventListener('click', e => {
  e.stopPropagation();
  fileInput.click();
});

// Click drop zone opens file picker (but not on input itself)
dropZone.addEventListener('click', e => {
  if (e.target === fileInput) return;
  fileInput.click();
});

// Keyboard accessibility
dropZone.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fileInput.click();
  }
});


/* =====================================================
   SCAN MODE TOGGLE (CAMERA / UPLOAD)
===================================================== */
scanModeToggle.addEventListener('click', e => {
  const btn = e.target.closest('.scan-mode-btn');
  if (!btn) return;

  const mode = btn.dataset.mode;
  scanModeBtns.forEach(b => b.classList.toggle('active', b.dataset.mode === mode));

  if (mode === 'camera') {
    cameraView.classList.remove('hidden');
    uploadView.classList.add('hidden');
  } else {
    // Stop camera if running
    if (APP_STATE.cameraStream) stopCamera();
    cameraView.classList.add('hidden');
    uploadView.classList.remove('hidden');
  }
});


/* =====================================================
   SCAN RESULT HANDLER
===================================================== */

/** Display the scanned QR result and categorize it */
function handleScanResult(data, fromCamera) {
  if (!data) return;

  // Stop camera loop (will restart after brief pause if camera mode)
  if (fromCamera) {
    APP_STATE.isScanning = false;
    if (APP_STATE.scanRAF) cancelAnimationFrame(APP_STATE.scanRAF);
    setCameraStatus('success', '✓ QR Code found!');

    // Resume scanning after 2.5 seconds
    setTimeout(() => {
      if (APP_STATE.cameraStream) {
        APP_STATE.isScanning = true;
        setCameraStatus('active', 'Scanning…');
        const ctx = scanCanvas.getContext('2d');
        ctx.clearRect(0, 0, scanCanvas.width, scanCanvas.height);
        scanLoop();
      }
    }, 2500);
  }

  // Detect type
  const detected = detectResultType(data);
  resultTypeBadge.textContent  = detected.label;
  resultTypeBadge.className    = 'result-type-badge ' + detected.cls;
  resultText.textContent       = data;

  // Show/hide action buttons
  if (detected.cls === 'url') {
    btnOpenLink.style.display = '';
    btnOpenLink.onclick = () => window.open(data, '_blank', 'noopener,noreferrer');
  } else {
    btnOpenLink.style.display = 'none';
  }

  // Show result panel
  resultEmpty.classList.add('hidden');
  resultContent.classList.remove('hidden');

  // Show success animation
  showSuccessAnim();

  // Toast
  showToast('QR code scanned successfully!', 'success');

  // Save to history
  saveToScanHistory(data, detected);
}

function detectResultType(str) {
  if (/^https?:\/\//i.test(str))               return { label: '🔗 URL',   cls: 'url'   };
  if (/^www\./i.test(str))                      return { label: '🔗 URL',   cls: 'url'   };
  if (/^mailto:/i.test(str))                    return { label: '✉️ Email', cls: 'email' };
  if (/^tel:/i.test(str))                       return { label: '📞 Phone', cls: 'phone' };
  if (/^WIFI:/i.test(str))                      return { label: '📶 WiFi',  cls: 'wifi'  };
  if (/^[\w.+-]+@[\w-]+\.[a-z]{2,}$/i.test(str)) return { label: '✉️ Email', cls: 'email' };
  return { label: '📝 Text', cls: 'text' };
}

function showScanError() {
  resultEmpty.classList.remove('hidden');
  resultContent.classList.add('hidden');
}

function showSuccessAnim() {
  scanSuccessAnim.classList.remove('hidden');
  setTimeout(() => scanSuccessAnim.classList.add('hidden'), 1100);
}

btnCopyResult.addEventListener('click', async () => {
  const text = resultText.textContent;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    showToast('Text copied to clipboard!', 'success');
  } catch {
    showToast('Copy failed', 'error');
  }
});

btnClearResult.addEventListener('click', () => {
  resultEmpty.classList.remove('hidden');
  resultContent.classList.add('hidden');
  // Reset upload view
  uploadPreviewImg.classList.add('hidden');
  dropContent.classList.remove('hidden');
  uploadPreviewImg.src = '';
  fileInput.value = '';
});


/* =====================================================
   HISTORY – STORAGE
===================================================== */

/** Save a generated QR to localStorage */
function saveToGenHistory(text) {
  // Don't save duplicates in rapid succession
  const history = getGenHistory();
  const last    = history[0];
  if (last && last.text === text) return;

  const thumb = qrCanvas.toDataURL('image/png');
  history.unshift({ text, thumb, date: Date.now() });
  if (history.length > 30) history.splice(30); // cap at 30

  localStorage.setItem(LS_KEYS.genHistory, JSON.stringify(history));
}

function getGenHistory() {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.genHistory)) || []; }
  catch { return []; }
}

/** Save a scanned result to localStorage */
function saveToScanHistory(text, detected) {
  const history = getScanHistory();
  history.unshift({ text, type: detected.label, cls: detected.cls, date: Date.now() });
  if (history.length > 30) history.splice(30);
  localStorage.setItem(LS_KEYS.scanHistory, JSON.stringify(history));
}

function getScanHistory() {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.scanHistory)) || []; }
  catch { return []; }
}

/** Format a timestamp as a relative date */
function relativeDate(ts) {
  const diff = Date.now() - ts;
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)    return 'just now';
  if (mins < 60)   return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days < 7)    return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}


/* =====================================================
   HISTORY – RENDERING
===================================================== */

function renderHistory() {
  renderGenHistory();
  renderScanHistory();
}

function renderGenHistory() {
  const history = getGenHistory();

  // Clear existing items (preserve empty state element)
  const existing = genHistoryList.querySelectorAll('.history-item');
  existing.forEach(el => el.remove());

  if (history.length === 0) {
    genHistoryEmpty.style.display = '';
    return;
  }

  genHistoryEmpty.style.display = 'none';

  history.forEach((item, idx) => {
    const el         = document.createElement('div');
    el.className     = 'history-item';
    el.dataset.index = idx;
    el.innerHTML     = `
      <div class="history-thumb">
        <img src="${item.thumb}" alt="QR code thumbnail" loading="lazy" />
      </div>
      <div class="history-info">
        <div class="history-text" title="${escapeHtml(item.text)}">${escapeHtml(truncate(item.text, 50))}</div>
        <div class="history-meta">${relativeDate(item.date)}</div>
      </div>
      <button class="history-del" data-idx="${idx}" title="Delete" aria-label="Delete history item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
      </button>
    `;

    // Click to re-generate
    el.addEventListener('click', e => {
      if (e.target.closest('.history-del')) return;
      activateTab('generate');
      setType('text');
      qrInput.value = item.text;
      generateQR();
    });

    // Delete button
    el.querySelector('.history-del').addEventListener('click', e => {
      e.stopPropagation();
      const h = getGenHistory();
      h.splice(idx, 1);
      localStorage.setItem(LS_KEYS.genHistory, JSON.stringify(h));
      renderGenHistory();
    });

    genHistoryList.appendChild(el);
  });
}

function renderScanHistory() {
  const history = getScanHistory();
  const existing = scanHistoryList.querySelectorAll('.history-item');
  existing.forEach(el => el.remove());

  if (history.length === 0) {
    scanHistoryEmpty.style.display = '';
    return;
  }

  scanHistoryEmpty.style.display = 'none';

  history.forEach((item, idx) => {
    const el         = document.createElement('div');
    el.className     = 'history-item';
    el.innerHTML     = `
      <div class="history-thumb-icon">
        ${getTypeIcon(item.cls)}
      </div>
      <div class="history-info">
        <div class="history-text" title="${escapeHtml(item.text)}">${escapeHtml(truncate(item.text, 50))}</div>
        <div class="history-meta">${item.type} &middot; ${relativeDate(item.date)}</div>
      </div>
      <button class="history-del" data-idx="${idx}" title="Delete" aria-label="Delete scan history item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
      </button>
    `;

    // Click to re-display result
    el.addEventListener('click', e => {
      if (e.target.closest('.history-del')) return;
      activateTab('scan');
      const detected = { label: item.type, cls: item.cls };
      resultTypeBadge.textContent  = item.type;
      resultTypeBadge.className    = 'result-type-badge ' + item.cls;
      resultText.textContent       = item.text;

      if (item.cls === 'url') {
        btnOpenLink.style.display = '';
        btnOpenLink.onclick = () => window.open(item.text, '_blank', 'noopener,noreferrer');
      } else {
        btnOpenLink.style.display = 'none';
      }

      resultEmpty.classList.add('hidden');
      resultContent.classList.remove('hidden');
    });

    el.querySelector('.history-del').addEventListener('click', e => {
      e.stopPropagation();
      const h = getScanHistory();
      h.splice(idx, 1);
      localStorage.setItem(LS_KEYS.scanHistory, JSON.stringify(h));
      renderScanHistory();
    });

    scanHistoryList.appendChild(el);
  });
}

function getTypeIcon(cls) {
  const icons = {
    url:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6.29 6.29l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    wifi:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
    text:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>`,
  };
  return icons[cls] || icons.text;
}

/* ── Clear history buttons ── */
btnClearGenHistory.addEventListener('click', () => {
  localStorage.removeItem(LS_KEYS.genHistory);
  renderGenHistory();
  showToast('Generate history cleared', 'info');
});

btnClearScanHistory.addEventListener('click', () => {
  localStorage.removeItem(LS_KEYS.scanHistory);
  renderScanHistory();
  showToast('Scan history cleared', 'info');
});


/* =====================================================
   TOAST NOTIFICATIONS
===================================================== */

/**
 * Show a toast notification
 * @param {string} message - Toast text
 * @param {'success'|'error'|'info'} type - Toast style
 * @param {number} duration - Auto-hide duration in ms
 */
function showToast(message, type = 'info', duration = 3000) {
  const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  };

  const toast       = document.createElement('div');
  toast.className   = `toast ${type}`;
  toast.innerHTML   = `${icons[type] || ''}<span>${escapeHtml(message)}</span>`;

  toastContainer.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  // Auto-dismiss
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 500);
  }, duration);
}


/* =====================================================
   UTILITY HELPERS
===================================================== */

function truncate(str, max) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


/* =====================================================
   INITIALIZATION
===================================================== */

function init() {
  // Check that CDN libraries loaded successfully
  if (typeof QRCode === 'undefined') {
    console.error('QRCode library failed to load. Check network connection.');
    showToast('QR library failed to load. Check your internet connection and refresh.', 'error', 8000);
    // Show banner in preview area
    const wrap = document.getElementById('qr-placeholder');
    if (wrap) {
      wrap.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:48px;height:48px;color:var(--error)">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p style="color:var(--error);font-weight:600">Library failed to load</p>
        <p style="font-size:0.8rem">Check your internet connection and refresh the page.</p>
      `;
    }
    return;
  }

  if (typeof jsQR === 'undefined') {
    console.warn('jsQR library failed to load. Scanning will be unavailable.');
    showToast('Scan library failed to load. QR generation still works.', 'error', 5000);
  }

  // Apply saved theme
  initTheme();

  // Initialize size slider fill
  const pct = ((parseInt(qrSize.value) - 128) / (512 - 128)) * 100;
  qrSize.style.setProperty('--pct', pct + '%');
  sizeValue.textContent = qrSize.value + ' px';

  // Set color previews
  fgPreview.style.background = qrFg.value;
  bgPreview.style.background = qrBg.value;

  // Render history
  renderHistory();

  // Set camera initial state display
  setCameraStatus('idle', 'Camera not started');

  // If camera API is unavailable, auto-switch to Upload mode and show notice
  if (!window.isSecureContext || !navigator.mediaDevices) {
    // Switch the mode toggle to "upload" so user sees working functionality first
    const uploadBtn = document.getElementById('scan-upload-btn');
    const cameraBtn = document.getElementById('scan-camera-btn');
    if (uploadBtn && cameraBtn) {
      uploadBtn.classList.add('active');
      cameraBtn.classList.remove('active');
      document.getElementById('camera-view').classList.add('hidden');
      document.getElementById('upload-view').classList.remove('hidden');
    }
    console.warn('Camera API not available (non-secure context). Upload mode active.');
  }

  console.log('%cQR Studio loaded ✓', 'color:#6366f1;font-weight:bold;font-size:14px;');
}

// Use window load (not DOMContentLoaded) so CDN scripts are guaranteed to have executed
window.addEventListener('load', init);
