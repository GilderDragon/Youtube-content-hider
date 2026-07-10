const CONFIG = {
  TAGS: [
	'ytd-rich-item-renderer', 'ytd-video-renderer', 'ytd-compact-video-renderer',
    'ytd-reel-video-renderer', 'ytd-grid-video-renderer',
    'ytd-watch-card-compact-video-renderer', 'ytd-universal-watch-card-renderer',
    'ytd-search-pyv-renderer', 'ytm-shorts-lockup-view-model-v2', 
    'ytd-video-preview-container', 'ytd-playlist-renderer', 
    'ytd-movie-renderer', 'ytd-rich-grid-row', 'yt-lockup-view-model'
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

  .yth-shorts-overlay {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 2 / 3 !important; 
    border-radius: 12px !important;
    background-size: 100% 100% !important; 
    background-position: center !important;
    z-index: 10 !important;
    transform: none !important;
    pointer-events: none !important;
  }

  .yth-sidebar-overlay {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    aspect-ratio: auto !important;
    border-radius: 10px !important;
    background-size: cover !important;
    background-position: center !important;
    z-index: 99 !important;
    pointer-events: none !important;
  }

  .yth-shorts-overlay .yth-shorts-overlay,
  .yth-shorts-overlay .yth-preview-overlay,
  ytd-shorts .yth-shorts-overlay,
  #shorts-container .yth-shorts-overlay {
    display: none !important;
    opacity: 0 !important;
  }
`;
(document.head || document.documentElement).appendChild(style);

