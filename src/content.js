let observer = null;
let throttleTimeout = null;

function throttledHideVideos() {
  if (throttleTimeout) return;
  throttleTimeout = setTimeout(() => {
    hideVideos();
    throttleTimeout = null;
  }, CONFIG.DELAY);
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

