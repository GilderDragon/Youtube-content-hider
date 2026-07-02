const input = document.getElementById('keyword-input');

const addBtn = document.getElementById('add-btn');

const listContainer = document.getElementById('keyword-list');

function renderList(keywords) {
  listContainer.innerHTML = '';
  
  if (keywords.length === 0) {
    listContainer.innerHTML = '<div class="empty-msg">List is empty</div>';
    return;
  }

  keywords.forEach((word, index) => {
    const item = document.createElement('div');
    item.className = 'keyword-item';
    item.innerHTML = `
      <span>${word}</span>
      <button class="delete-btn" data-index="${index}">✕</button>
    `;
    listContainer.appendChild(item);
  });
}

chrome.storage.local.get({ blockedKeywords: [] }, (data) => {
  renderList(data.blockedKeywords);
});

addBtn.addEventListener('click', () => {
  const word = input.value.trim().toLowerCase();
  if (!word) return;

  chrome.storage.local.get({ blockedKeywords: [] }, (data) => {
    const keywords = data.blockedKeywords;
    
    if (!keywords.includes(word)) {
      keywords.push(word);
      chrome.storage.local.set({ blockedKeywords: keywords }, () => {
        renderList(keywords);
        input.value = '';
      });
    }
  });
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

listContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const indexToRemove = parseInt(e.target.getAttribute('data-index'), 10);
    
    chrome.storage.local.get({ blockedKeywords: [] }, (data) => {
      const keywords = data.blockedKeywords;
      keywords.splice(indexToRemove, 1);
      
      chrome.storage.local.set({ blockedKeywords: keywords }, () => {
        renderList(keywords);
      });
    });
  }
});

