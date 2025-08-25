const imageResize = (
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number },
): Promise<Blob> => {
  const worker = new Worker(new URL('../worker/image.worker.ts', import.meta.url), {
    type: 'module',
  });

  return new Promise<Blob>((resolve, reject) => {
    worker.onmessage = (e) => {
      worker.terminate();
      resolve(e.data);
    };
    worker.onerror = (error) => {
      worker.terminate();
      reject(error);
    };
    worker.postMessage({
      file,
      maxWidth: options?.maxWidth ?? 1200,
      maxHeight: options?.maxHeight ?? 1200,
      quality: options?.quality ?? 0.8,
    });
  });
};

export default imageResize;
