const CONFIG = {
  TAGS: [
    'ytd-rich-item-renderer', 'ytd-video-renderer', 'ytd-compact-video-renderer',
    'ytd-reel-video-renderer', 'ytd-grid-video-renderer',
    'ytd-watch-card-compact-video-renderer', 'ytd-universal-watch-card-renderer',
    'ytd-search-pyv-renderer', 'ytm-shorts-lockup-view-model',
    '[class*="shortsLockupViewModel"]', 'ytd-video-preview-container',
    'ytd-playlist-renderer', 'ytd-movie-renderer', 'ytd-rich-grid-row'
  ]
};

const imageCache = {};

function generateBlockedImage(keyword) {
  if (imageCache[keyword]) return imageCache[keyword];

  const canvas = document.createElement('canvas');
  canvas.width = 1280; 
  canvas.height = 720;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#0a0a0d');
  gradient.addColorStop(0.5, '#111116');
  gradient.addColorStop(1, '#170f12');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
  ctx.lineWidth = 2;
  for (let i = 0; i < canvas.width; i += 60) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 60) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
  }

  ctx.shadowColor = '#ff2a5f';
  ctx.shadowBlur = 30;
  ctx.strokeStyle = '#ff2a5f';
  ctx.lineWidth = 14;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
  ctx.shadowBlur = 0; 

  ctx.fillStyle = '#ff2a5f';
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2 - 120, 55, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 18, canvas.height / 2 - 138);
  ctx.lineTo(canvas.width / 2 + 18, canvas.height / 2 - 102);
  ctx.moveTo(canvas.width / 2 + 18, canvas.height / 2 - 138);
  ctx.lineTo(canvas.width / 2 - 18, canvas.height / 2 - 102);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '50px "Segoe UI", Roboto, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.letterSpacing = "4px";
  ctx.fillText('SPOILER HIDDEN', canvas.width / 2, canvas.height / 2 + 25);

  ctx.font = '600 38px "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = "0px";
  ctx.fillStyle = '#ff8fa3';
  ctx.fillText(`May contain keyword: "${keyword}"`, canvas.width / 2, canvas.height / 2 + 115);

  ctx.font = '500 32px "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('Click to watch anyway', canvas.width / 2, canvas.height / 2 + 185);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.font = 'bold 24px "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = "1px";
  ctx.fillText('FILTERED BY YT CONTENT HIDER', canvas.width / 2, canvas.height - 65);

  const dataUrl = canvas.toDataURL('image/png');
  imageCache[keyword] = dataUrl;
  return dataUrl;
}

const style = document.createElement('style');
style.textContent = `
  .yth-blocked-card {
    position: relative !important;
  }
  .yth-preview-overlay {
    position: absolute !important;
    top: 0 !important; 
    left: 0 !important; 
    width: 100% !important;
    aspect-ratio: 16 / 9 !important; 
    z-index: 9 !important; 
    background-size: cover !important;
    background-position: center !important;
    border-radius: 12px !important;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.6) !important;
    pointer-events: none !important; 
  }
  ytd-reel-video-renderer .yth-preview-overlay,
  ytm-shorts-lockup-view-model .yth-preview-overlay,
  [class*="shortsLockupViewModel"] .yth-preview-overlay {
    height: 100% !important;
    aspect-ratio: auto !important;
  }
`;
(document.head || document.documentElement).appendChild(style);

let blockedKeywords = [];
let observer = null;
let isEnabled = true;

function containsBlockedKeywords(text) {
  if (!text || blockedKeywords.length === 0) return null;
  const lower = text.toLowerCase();
  return blockedKeywords.find(kw => lower.includes(kw)) || null;
}

function blockCard(card, keyword) {
  if (card.hasAttribute('data-blocked')) return;
  card.setAttribute('data-blocked', 'true');
  card.classList.add('yth-blocked-card');

  const imgUrl = generateBlockedImage(keyword);
  
  const overlay = document.createElement('div');
  overlay.className = 'yth-preview-overlay';
  overlay.style.backgroundImage = `url(${imgUrl})`;

  card.appendChild(overlay);
}

function unblockAllCards() {
  document.querySelectorAll('[data-blocked]').forEach(card => {
    card.removeAttribute('data-blocked');
    card.classList.remove('yth-blocked-card');
    card.querySelectorAll('.yth-preview-overlay').forEach(el => el.remove());
  });
}

function hideVideos() {
  if (!isEnabled || blockedKeywords.length === 0) return;

  const cards = document.querySelectorAll(CONFIG.TAGS.join(','));
  cards.forEach(card => {
    if (card.hasAttribute('data-blocked')) return;

    let text = (card.textContent || '') + ' ';
    
    const links = card.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
      text += ' ' + (links[i].getAttribute('title') || links[i].getAttribute('aria-label') || '');
    }

    const matched = containsBlockedKeywords(text);
    if (matched) blockCard(card, matched);
  });
}

let throttleTimeout = null;
function throttledHideVideos() {
  if (throttleTimeout) return;
  throttleTimeout = setTimeout(() => {
    hideVideos();
    throttleTimeout = null;
  }, 100);
}

function initObserver() {
  if (observer) observer.disconnect();
  observer = new MutationObserver(throttledHideVideos);
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

chrome.storage.local.get({ blockedKeywords: [], isEnabled: true }, (data) => {
  blockedKeywords = data.blockedKeywords || [];
  isEnabled = data.isEnabled !== false;
  if (isEnabled) {
    hideVideos();
    initObserver();
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedKeywords) {
    blockedKeywords = changes.blockedKeywords.newValue || [];
    unblockAllCards();
    hideVideos();
  }
  if (changes.isEnabled !== undefined) {
    isEnabled = changes.isEnabled.newValue;
    if (!isEnabled) {
      if (observer) observer.disconnect();
      unblockAllCards();
    } else {
      initObserver();
      hideVideos();
    }
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "refresh") {
    unblockAllCards();
    hideVideos();
  }
});

