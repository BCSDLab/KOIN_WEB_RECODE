export interface ResizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

const resizeImageFile = async (
  file: File,
  {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
  }: ResizeOptions = {},
): Promise<Blob> => {
  const bitmap = await createImageBitmap(file);

  const ratio = Math.min(maxWidth / bitmap.width, maxHeight / bitmap.height, 1);
  const width = Math.round(bitmap.width * ratio);
  const height = Math.round(bitmap.height * ratio);

  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext('2d');

  if (!context) return file;
  context.drawImage(bitmap, 0, 0, width, height);

  return canvas.convertToBlob({ type: 'image/webp', quality });
};

export default resizeImageFile;
