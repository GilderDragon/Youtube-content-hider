function generateBlockedImage(keyword) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 360;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#141414';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#cc1818';
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

  ctx.fillStyle = '#ff4d4d';
  ctx.font = 'bold 32px sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText('CONTENT HIDDEN', canvas.width / 2, canvas.height / 2 - 40);

  ctx.fillStyle = '#aaaaaa';
  ctx.font = 'italic 24px sans-serif';
  ctx.fillText(`May contain information about "${keyword}"`, canvas.width / 2, canvas.height / 2 + 30);

  return canvas.toDataURL('image/png');
}

