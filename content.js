const BLOCKED_KEYWORDS = ['gta6', 'gta 6', 'gtavi', 'gta vi'];

function containsBlockedKeywords(text) {
	const lower = text.toLowerCase();
	return BLOCKED_KEYWORDS.some(keyword => lower.includes(keyword));
}

function hideVideos() {
	const selectors = [
		'ytd-rich-item-renderer',
		'ytd-video-renderer',
		'ytd-compact-videor-renderer'
	];

	selectors.forEach(selector => {
		document.querySelectorAll(selector).forEach(item => {
			const titleElement = item.querySelector('#video-title, #title, .title');
			if (!titleElement) return;

			const titleText = titleElement.textContent.trim();
			if (containsBlockedKeywords(titleText)) {
				item.style.display = 'none';
			}
		})
	})
}

hideVideos();

const observer = new MutationObserver(() => {
	hideVideos();
});

observer.observe(document.body, {
	childList: true,
	subtree: true
});

