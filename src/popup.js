const input = document.getElementById('keyword-input');
const addBtn = document.getElementById('add-btn');
const listContainer = document.getElementById('keyword-list');
const clearBtn = document.getElementById('clear-btn');
const toggleBtn = document.getElementById('toggle-btn');
const versionFooter = document.getElementById('version-footer');
const errorMsg = document.getElementById('error-message');

let isEnabled = true;
let clearConfirmActive = false;
let clearTimer = null;

function showError() {
  errorMsg.classList.add('show');
  setTimeout(() => errorMsg.classList.remove('show'), 2000);
}

function renderList(keywords) {
  listContainer.innerHTML = '';
  if (keywords.length === 0) {
    listContainer.innerHTML = '<div class="empty-msg">No keywords added yet.<br>Add words to hide spoilers & clickbait.</div>';
    return;
  }

  keywords.forEach((word, index) => {
    const item = document.createElement('div');
    item.className = 'keyword-item';
    item.innerHTML = `
      <span>${word}</span>
      <button class="delete-btn" data-index="${index}" title="Remove">✕</button>
    `;
    listContainer.appendChild(item);
  });
}

function loadSettings() {
  chrome.storage.local.get({ blockedKeywords: [], isEnabled: true }, (data) => {
    isEnabled = data.isEnabled !== false;
    updateToggleButton();
    renderList(data.blockedKeywords);
    
    const manifest = chrome.runtime.getManifest();
    if (versionFooter) {
      versionFooter.textContent = `v${manifest.version} • Protection Active`;
    }
  });
}

function updateToggleButton() {
  if (isEnabled) {
    toggleBtn.textContent = '🛡️ Extension: ENABLED';
    toggleBtn.style.backgroundColor = 'rgba(62, 166, 255, 0.15)';
    toggleBtn.style.color = '#3ea6ff';
    toggleBtn.style.border = '1px solid #3ea6ff';
  } else {
    toggleBtn.textContent = '🛡️ Extension: DISABLED';
    toggleBtn.style.backgroundColor = 'rgba(255, 42, 95, 0.15)';
    toggleBtn.style.color = '#ff2a5f';
    toggleBtn.style.border = '1px solid #ff2a5f';
  }
}

function notifyActiveTabs() {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs[0] && tabs[0].url && tabs[0].url.includes("youtube.com")) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "refresh" }, () => {
        if (chrome.runtime.lastError) {  }
      });
    }
  });
}

toggleBtn.addEventListener('click', () => {
  isEnabled = !isEnabled;
  chrome.storage.local.set({ isEnabled: isEnabled }, () => {
    updateToggleButton();
    notifyActiveTabs();
  });
});

addBtn.addEventListener('click', () => {
  const word = input.value.trim().toLowerCase();
  if (!word) return;

  chrome.storage.local.get({ blockedKeywords: [] }, (data) => {
    let keywords = data.blockedKeywords;
    if (!keywords.includes(word)) {
      keywords.push(word);
      chrome.storage.local.set({ blockedKeywords: keywords }, () => {
        renderList(keywords);
        input.value = '';
        notifyActiveTabs();
      });
    } else {
      showError();
    }
  });
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

listContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const index = parseInt(e.target.getAttribute('data-index'), 10);
    chrome.storage.local.get({ blockedKeywords: [] }, (data) => {
      let keywords = data.blockedKeywords;
      keywords.splice(index, 1);
      chrome.storage.local.set({ blockedKeywords: keywords }, () => {
        renderList(keywords);
        notifyActiveTabs();
      });
    });
  }
});

clearBtn.addEventListener('click', () => {
  if (!clearConfirmActive) {
    clearConfirmActive = true;
    clearBtn.textContent = '⚠️ Click again to confirm!';
    clearBtn.style.backgroundColor = 'rgba(255, 42, 95, 0.1)';
    
    clearTimer = setTimeout(() => {
      clearConfirmActive = false;
      clearBtn.textContent = 'Clear All Keywords';
      clearBtn.style.backgroundColor = 'transparent';
    }, 3000);
  } else {
    clearTimeout(clearTimer);
    clearConfirmActive = false;
    clearBtn.textContent = 'Clear All Keywords';
    clearBtn.style.backgroundColor = 'transparent';
    
    chrome.storage.local.set({ blockedKeywords: [] }, () => {
      renderList([]);
      notifyActiveTabs();
    });
  }
});

loadSettings();

