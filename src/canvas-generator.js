const imageCache = {};
let isFontLoaded = false;

function drawCoverImage(ctx, canvas, bgSrc) {
  return new Promise((resolve) => {
    const bgImage = new Image();
    bgImage.src = chrome.runtime.getURL(bgSrc);

    bgImage.onload = () => {
      const hRatio = canvas.width / bgImage.width;
      const vRatio = canvas.height / bgImage.height;
      const ratio = Math.max(hRatio, vRatio);
      const offsetX = (canvas.width - bgImage.width * ratio) / 2;
      const offsetY = (canvas.height - bgImage.height * ratio) / 2;
      ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height, offsetX, offsetY, bgImage.width * ratio, bgImage.height * ratio);
      resolve(true);
    };

    bgImage.onerror = () => {
      resolve(false);
    };
  });
}

async function ensureFontIsReady() {
  if (isFontLoaded) return true;
  try {
    const fontUrl = chrome.runtime.getURL('resources/HeavyFalcon.otf');
    const customFont = new FontFace('HeavyFalcon', `url(${fontUrl})`);
    
    const loadedFont = await customFont.load();
    document.fonts.add(loadedFont);
    
    isFontLoaded = true;
    return true;
  } catch (err) {
    return false;
  }
}

function generateBlockedImage(keyword) {
  if (imageCache[keyword]) return Promise.resolve(imageCache[keyword]);

  return new Promise(async (resolve) => {
    await ensureFontIsReady();

    const canvas = document.createElement('canvas');
    canvas.width = 1280; 
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    const isBgLoaded = await drawCoverImage(ctx, canvas, 'resources/bg_regular.png');

    if (!isBgLoaded) {
      const fallbackDataUrl = generateOldBlockedImage(keyword);
      imageCache[keyword] = fallbackDataUrl;
      return resolve(fallbackDataUrl);
    }

    ctx.font = '60px "HeavyFalcon", sans-serif'; 
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';      
    ctx.textBaseline = 'top';

    ctx.shadowColor = '#ff2a5f';
    ctx.shadowBlur = 10;

    const startX = 50;  
    let startY = 130;   
    const lineHeight = 70; 

    const lines = [
      'THIS VIDEO MIGHT',
      'CONTAIN INFORMATION',
      `ABOUT "${keyword.toUpperCase()}"`,
      'SO, WE COVERED IT.',
      'WITH LOVE,'
    ];

    lines.forEach(line => {
      ctx.fillText(line, startX, startY);
      startY += lineHeight;
    });

    ctx.shadowBlur = 0;

    const dataUrl = canvas.toDataURL('image/png');
    imageCache[keyword] = dataUrl;
    resolve(dataUrl);
  });
}

function generateBlockedShortsImage(keyword) {
  const cacheKey = `shorts_${keyword}`;
  if (imageCache[cacheKey]) return Promise.resolve(imageCache[cacheKey]);

  return new Promise(async (resolve) => {
    await ensureFontIsReady();

    const canvas = document.createElement('canvas');
    canvas.width = 720; 
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    const isBgLoaded = await drawCoverImage(ctx, canvas, 'resources/bg_shorts.png');

    if (!isBgLoaded) {
      const fallbackDataUrl = generateOldBlockedShortsImage(keyword);
      imageCache[cacheKey] = fallbackDataUrl;
      return resolve(fallbackDataUrl);
    }

    ctx.font = '34px "HeavyFalcon", sans-serif'; 
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    ctx.shadowColor = '#ff2a5f';
    ctx.shadowBlur = 10;

    const centerX = canvas.width / 2;
    let startY = 140; 
    const lineHeight = 55;

    ctx.fillText('THIS VIDEO MIGHT', centerX, startY);
    startY += lineHeight;
    ctx.fillText('CONTAIN INFORMATION', centerX, startY);
    startY += lineHeight;
    ctx.fillText('ABOUT', centerX, startY);
    startY += lineHeight;

    ctx.fillStyle = '#ff8fa3';
    const maxTextWidth = canvas.width - 100; 
    const displayKeyword = keyword.toUpperCase();
    
    ctx.fillText(`"${displayKeyword}"`, centerX, startY, maxTextWidth);
    startY += lineHeight + 15; 

    ctx.fillStyle = '#ffffff';
    ctx.fillText('SO, WE COVERED IT.', centerX, startY);
    startY += lineHeight;
    ctx.fillText('WITH LOVE,', centerX, startY);

    ctx.shadowBlur = 0;

    const dataUrl = canvas.toDataURL('image/png');
    imageCache[cacheKey] = dataUrl;
    resolve(dataUrl);
  });
}

function generateOldBlockedImage(keyword) {
  if (imageCache[keyword]) return imageCache[keyword];

  const canvas = document.createElement('canvas');
  canvas.width = 1280; 
  canvas.height = 720;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#0a0a0d');
  gradient.addColorStop(0.5, '#111116');
  gradient.addColorStop(1, '#170f12');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
  ctx.lineWidth = 2;
  for (let i = 0; i < canvas.width; i += 60) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 60) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
  }

  ctx.shadowColor = '#ff2a5f';
  ctx.shadowBlur = 30;
  ctx.strokeStyle = '#ff2a5f';
  ctx.lineWidth = 14;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
  ctx.shadowBlur = 0; 

  ctx.fillStyle = '#ff2a5f';
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2 - 120, 55, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 18, canvas.height / 2 - 138);
  ctx.lineTo(canvas.width / 2 + 18, canvas.height / 2 - 102);
  ctx.moveTo(canvas.width / 2 + 18, canvas.height / 2 - 138);
  ctx.lineTo(canvas.width / 2 - 18, canvas.height / 2 - 102);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '50px "Segoe UI", Roboto, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.letterSpacing = "4px";
  ctx.fillText('SPOILER HIDDEN', canvas.width / 2, canvas.height / 2 + 25);

  ctx.font = '600 38px "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = "0px";
  ctx.fillStyle = '#ff8fa3';
  ctx.fillText(`May contain keyword: "${keyword}"`, canvas.width / 2, canvas.height / 2 + 115);

  ctx.font = '500 32px "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('Click to watch anyway', canvas.width / 2, canvas.height / 2 + 185);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.font = 'bold 24px "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = "1px";
  ctx.fillText('FILTERED BY YT CONTENT HIDER', canvas.width / 2, canvas.height - 65);

  const dataUrl = canvas.toDataURL('image/png');
  imageCache[keyword] = dataUrl;
  return dataUrl;
}

function generateOldBlockedShortsImage(keyword) {
  const cacheKey = `shorts_${keyword}`;
  if (imageCache[cacheKey]) return imageCache[cacheKey];

  const canvas = document.createElement('canvas');
  canvas.width = 720; 
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0d0d11');
  gradient.addColorStop(0.5, '#141419');
  gradient.addColorStop(1, '#1a1114');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
  ctx.lineWidth = 2;
  for (let i = 0; i < canvas.width; i += 45) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 45) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
  }

  ctx.shadowColor = '#ff2a5f';
  ctx.shadowBlur = 30;
  ctx.strokeStyle = '#ff2a5f';
  ctx.lineWidth = 14;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
  ctx.shadowBlur = 0; 

  ctx.fillStyle = '#ff2a5f';
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2 - 180, 60, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 20, canvas.height / 2 - 200);
  ctx.lineTo(canvas.width / 2 + 20, canvas.height / 2 - 160);
  ctx.moveTo(canvas.width / 2 + 20, canvas.height / 2 - 200);
  ctx.lineTo(canvas.width / 2 - 20, canvas.height / 2 - 160);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '52px "Segoe UI", Roboto, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.letterSpacing = "4px";
  ctx.fillText('SPOILER', canvas.width / 2, canvas.height / 2 - 60);
  ctx.fillText('HIDDEN', canvas.width / 2, canvas.height / 2 + 10);

  ctx.font = '600 30px "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = "0px";
  ctx.fillStyle = '#ff8fa3';
  const displayKeyword = keyword.length > 15 ? keyword.substring(0, 12) + '...' : keyword;
  ctx.fillText(`May contain keyword:`, canvas.width / 2, canvas.height / 2 + 110);
  ctx.fillText(`"${displayKeyword}"`, canvas.width / 2, canvas.height / 2 + 160);

  ctx.font = '500 28px "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('Click to watch anyway', canvas.width / 2, canvas.height / 2 + 240);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.font = 'bold 18px "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = "1px";
  ctx.fillText('FILTERED BY YT CONTENT HIDER', canvas.width / 2, canvas.height - 80);

  const dataUrl = canvas.toDataURL('image/png');
  imageCache[cacheKey] = dataUrl;
  return dataUrl;
}

