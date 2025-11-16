self.onmessage = async (e) => {
  const { file, maxWidth = 1200, maxHeight = 1200, quality = 0.8 } = e.data;

  const bmp = await createImageBitmap(file);

  const ratio = Math.min(maxWidth / bmp.width, maxHeight / bmp.height, 1);
  const w = Math.round(bmp.width * ratio);
  const h = Math.round(bmp.height * ratio);

  const canvas = new OffscreenCanvas(w, h);
  const context = canvas.getContext('2d');

  if (!context) return;
  context.drawImage(bmp, 0, 0, w, h);

  const blob = await canvas.convertToBlob({ type: 'image/webp', quality });
  self.postMessage(blob);
};
