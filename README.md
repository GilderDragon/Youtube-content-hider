# YouTube Content Hider

> Hide YouTube videos that contain unwanted keywords – take back control of your feed.

## Features

- **Keyword‑based filtering** – add any words or phrases you want to block.
- **Real‑time hiding** – uses `MutationObserver` to catch new videos as they load (scrolling, navigation, dynamic updates).
- **Visual overlay** – blocked videos are covered with a stylish overlay that shows: the **triggering keyword** so you know why it was hidden.
- **Works everywhere on YouTube** – homepage, search results, sidebar recommendations, playlists, and even **Shorts** (with a special vertical overlay).
- **Smart Canvas‑generated overlays** – each block is a uniquely generated image, cached for performance.
- **Easy management popup** – add or remove keywords with duplicate detection.
- **One‑click enable/disable** – turn the filter on or off without losing your keyword list.
- **Lightweight and performant** – minimal impact on browsing.

## How it works

- The extension injects a content script into YouTube pages.
- A `MutationObserver` watches for DOM changes (new video cards, infinite scroll, navigation).
- For each new video element (homepage, search, sidebar, Shorts, playlists), it checks text content against your blocklist.
- If a match is found, it generates a canvas‑based overlay (with the blocked keyword) and places it exactly over the video thumbnail.
- All settings are stored in `chrome.storage.local` and sync across tabs.

## Technologies used

- **JavaScript (ES6)** – core logic
- **HTML & CSS** – popup interface and overlays
- **Canvas API** – dynamic image generation for overlays
- **Browser Extensions API** – Manifest v3 (Chromium) / compatible with Firefox
- **MutationObserver** – real‑time DOM monitoring
- **Chrome Storage API** – persistent settings

## Project structure
```
Youtube-content-hider/
│
├── manifest.json                # Extension manifest (Manifest V3)
├── resources/                   # Static assets
│   ├── icon_16.png              # Toolbar icon (16×16)
│   ├── icon_48.png              # Extension management icon (48×48)
│   └── icon_128.png             # Store listing icon (128×128)
└── src/                         # Source files
    ├── config.js                # Configuration (selectors, styles, constants)
    ├── canvas-generator.js      # Canvas overlay generation with caching
    ├── dom-filter.js            # Keyword checking and block/unblock logic
    ├── content.js               # Main script – Observer and messaging
    ├── popup.html               # Popup UI layout
    └── popup.js                 # Popup logic – keyword management
```
