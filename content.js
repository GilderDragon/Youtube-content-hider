const BLOCKED_KEYWORDS = ['gta6', 'gta 6', 'gtavi', 'gta vi', 'grand theft auto vi'];

const TAGS = [
    'ytd-rich-item-renderer',
    'ytd-video-renderer',
    'ytd-compact-video-renderer',
    'ytd-reel-video-renderer',
    'ytd-grid-video-renderer',
    'ytd-watch-card-compact-video-renderer',
    'ytd-universal-watch-card-renderer',
    'ytd-search-pyv-renderer',
    'ytm-shorts-lockup-view-model',
    '[class*="shortsLockupViewModel"]',
    'ytd-video-preview-container'
];

function containsBlockedKeywords(text) {
	if (!text) return false;

	const lower = text.toLowerCase();
	return BLOCKED_KEYWORDS.some(keyword => lower.includes(keyword));
}

function hideVideos() {
  const videoCards = document.querySelectorAll(TAGS.join(','));

  videoCards.forEach(card => {
    if (card.style.display === 'none') return;

    const visibleText = card.textContent ? card.textContent.trim() : '';
    
    let extraText = '';
    card.querySelectorAll('a, img, span, h2, h3, h4').forEach(innerNode => {
      extraText += ' ' + (innerNode.getAttribute('title') || '');
      extraText += ' ' + (innerNode.getAttribute('aria-label') || '');
      extraText += ' ' + (innerNode.getAttribute('href') || '');
    });

    if (containsBlockedKeywords(visibleText + extraText)) {
      card.style.setProperty('display', 'none', 'important');
    }
  });
}

hideVideos();

const observer = new MutationObserver(() => {
	hideVideos();
});

observer.observe(document.body, {
	childList: true,
	subtree: true
});

