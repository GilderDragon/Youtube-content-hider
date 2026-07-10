let blockedKeywords = [];
let isEnabled = true;

function containsBlockedKeywords(text) {
  if (!text || blockedKeywords.length === 0) return null;
  const lower = text.toLowerCase();
  return blockedKeywords.find(kw => lower.includes(kw)) || null;
}

function blockCard(card, keyword) {
  if (card.hasAttribute('data-blocked') || card.closest('[data-blocked]')) return;

  if (card.closest('ytd-shorts') || card.closest('#shorts-container') || window.location.pathname.startsWith('/shorts')) {
    return;
  }

  const tagName = card.tagName.toLowerCase();

  const isShorts = tagName === 'ytd-reel-video-renderer' || 
                   tagName === 'ytm-shorts-lockup-view-model' ||
                   tagName === 'ytm-shorts-lockup-view-model-v2' || 
                   card.className.includes('shortsLockupViewModel') ||
                   card.querySelector('ytd-reel-video-renderer, [class*="shortsLockupViewModel"]') !== null;

  const isSidebar = tagName === 'ytd-compact-video-renderer' || 
                    tagName === 'yt-lockup-view-model' || 
                    !!card.closest('#items.ytd-watch-next-secondary-results-renderer');

  let targetContainer = card;
  if (isSidebar) {
    const foundThumb = card.querySelector('.ytThumbnailViewModelImage, ytd-thumbnail, [class*="ThumbnailViewModelImage"], yt-thumbnail-view-model');
    if (foundThumb) targetContainer = foundThumb;
  }

  if (targetContainer.hasAttribute('data-blocked') || targetContainer.querySelector('.yth-preview-overlay, .yth-shorts-overlay, .yth-sidebar-overlay')) {
    card.setAttribute('data-blocked', 'true');
    return;
  }

  card.setAttribute('data-blocked', 'true');
  targetContainer.setAttribute('data-blocked', 'true');
  card.classList.add('yth-blocked-card');

  const overlay = document.createElement('div');

  if (isShorts) {
    overlay.className = 'yth-preview-overlay yth-shorts-overlay';
    overlay.style.backgroundImage = `url(${generateBlockedShortsImage(keyword)})`;
    targetContainer.appendChild(overlay);
  } else if (isSidebar) {
    overlay.className = 'yth-preview-overlay yth-sidebar-overlay';
    overlay.style.backgroundImage = `url(${generateBlockedImage(keyword)})`;
    
    targetContainer.dataset.origPosition = targetContainer.style.position;
    targetContainer.dataset.origOverflow = targetContainer.style.overflow;
    targetContainer.dataset.origDisplay = targetContainer.style.display;
    
    targetContainer.style.setProperty('position', 'relative', 'important');
    targetContainer.style.setProperty('overflow', 'hidden', 'important');
    targetContainer.style.setProperty('display', 'block', 'important');
    
    targetContainer.appendChild(overlay);
  } else {
    overlay.className = 'yth-preview-overlay';
    overlay.style.backgroundImage = `url(${generateBlockedImage(keyword)})`;
    targetContainer.appendChild(overlay);
  }
}

function unblockAllCards() {
  document.querySelectorAll('[data-blocked]').forEach(card => {
    card.removeAttribute('data-blocked');
    card.classList.remove('yth-blocked-card');

    if (card.dataset.origPosition !== undefined) {
      if (card.dataset.origPosition === "") {
        card.style.removeProperty('position');
      } else {
        card.style.position = card.dataset.origPosition;
      }
      delete card.dataset.origPosition;
    }

    if (card.dataset.origOverflow !== undefined) {
      if (card.dataset.origOverflow === "") {
        card.style.removeProperty('overflow');
      } else {
        card.style.overflow = card.dataset.origOverflow;
      }
      delete card.dataset.origOverflow;
    }

    if (card.dataset.origDisplay !== undefined) {
      if (card.dataset.origDisplay === "") {
        card.style.removeProperty('display');
      } else {
        card.style.display = card.dataset.origDisplay;
      }
      delete card.dataset.origDisplay;
    }

    card.querySelectorAll('.yth-preview-overlay, .yth-shorts-overlay, .yth-sidebar-overlay').forEach(el => el.remove());
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

