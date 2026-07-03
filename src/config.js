const CONFIG = {
  TAGS: [
    'ytd-rich-item-renderer', 'ytd-video-renderer', 'ytd-compact-video-renderer',
    'ytd-reel-video-renderer', 'ytd-grid-video-renderer',
    'ytd-watch-card-compact-video-renderer', 'ytd-universal-watch-card-renderer',
    'ytd-search-pyv-renderer', 'ytm-shorts-lockup-view-model',
    '[class*="shortsLockupViewModel"]', 'ytd-video-preview-container',
    'ytd-playlist-renderer', 'ytd-movie-renderer', 'ytd-rich-grid-row'
  ],
  DELAY: 100
};

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

