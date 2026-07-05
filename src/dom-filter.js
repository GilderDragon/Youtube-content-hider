let blockedKeywords = [];
let isEnabled = true;

function containsBlockedKeywords(text) {
  if (!text || blockedKeywords.length === 0) return null;
  const lower = text.toLowerCase();
  return blockedKeywords.find(kw => lower.includes(kw)) || null;
}

function blockCard(card, keyword) {
  if (card.hasAttribute('data-blocked')) return;

  const isShorts = card.tagName.toLowerCase() === 'ytd-reel-video-renderer' ||
		card.tagName.toLowerCase() === 'ytm-shorts-lockup-view-model' ||
		card.className.includes('shortsLockupViewModel') ||
		card.querySelector('ytd-reel-video-renderer, ytm-shorts-lockup-view-model, [class*="shortsLockupViewModel"]') !== null;

  if (card.querySelector('[data-blocked]') || card.closest('[data-blocked]')) return;

  card.setAttribute('data-blocked', 'true');
  card.classList.add('yth-blocked-card');

  const overlay = document.createElement('div');

  if (isShorts) {
    overlay.className = 'yth-preview-overlay yth-shorts-overlay';
    overlay.style.backgroundImage = `url(${generateBlockedShortsImage(keyword)})`;
  } else {
    overlay.className = 'yth-preview-overlay';
    overlay.style.backgroundImage = `url(${generateBlockedImage(keyword)})`;
  }
  
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

