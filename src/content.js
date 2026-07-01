const DELAY = 250;

const REPLACEMENT_IMAGE_URL = chrome.runtime.getURL('resources/blocked.png'); 

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
    'ytd-video-preview-container',
	'ytd-video-preview'
];

const style = document.createElement('style');
style.textContent = `
  ${TAGS.join(', ')} { visibility: hidden !important; }
  .yt-verified-card { visibility: visible !important; }

  .yt-blocked-done ytd-video-preview,
  .yt-blocked-done [id*="preview"],
  .yt-blocked-done video {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    max-height: 0px !important;
    pointer-events: none !important;
  }
`;
(document.head || document.documentElement).appendChild(style);

function containsBlockedKeywords(text) {
	if (!text) return false;
	const lower = text.toLowerCase();
	return BLOCKED_KEYWORDS.some(keyword => lower.includes(keyword));
}

function hideVideos() {
  const videoCards = document.querySelectorAll(TAGS.join(','));

  videoCards.forEach(card => {
    if (card.classList.contains('yt-blocked-done')) {
		card.querySelectorAll('ytd-video-preview, [id*="preview"], video').forEach(preview => preview.remove());
		return;
	}

    const visibleText = card.textContent ? card.textContent.trim() : '';
    
    let extraText = '';
    card.querySelectorAll('a, img, span, h2, h3, h4').forEach(innerNode => {
      extraText += ' ' + (innerNode.getAttribute('title') || '');
      extraText += ' ' + (innerNode.getAttribute('aria-label') || '');
      extraText += ' ' + (innerNode.getAttribute('href') || '');
    });

    if (containsBlockedKeywords(visibleText + extraText)) {
      card.classList.add('yt-blocked-done');

      card.querySelectorAll('img').forEach(img => {
        if (!img.closest('#avatar, .avatar, [class*="avatar" i]')) {
          img.src = REPLACEMENT_IMAGE_URL;
          img.srcset = REPLACEMENT_IMAGE_URL; 
        }
      });

		card.querySelectorAll('ytd-video-preview, [id*="preview"]').forEach(preview => preview.remove());
    }

    card.classList.add('yt-verified-card');
  });
}

let isWaiting = false;
let timeoutId;

function processMutationsWithDebounce() {
	if (isWaiting) return;

	isWaiting = true;
	clearTimeout(timeoutId);

	timeoutId = setTimeout(() => {
		hideVideos();
		isWaiting = false;
	}, DELAY);
}

hideVideos();

const observer = new MutationObserver(processMutationsWithDebounce);

observer.observe(document.documentElement, {
	childList: true,
	subtree: true
});

