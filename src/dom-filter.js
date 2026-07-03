let blockedKeywords = [];
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

