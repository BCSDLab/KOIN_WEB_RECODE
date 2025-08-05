import React from 'react';
import showToast from 'utils/ts/showToast';

function useImageDownload() {
  const divRef = React.useRef<HTMLDivElement>(null);

  const onImageDownload = async (imageName: string) => {
    if (!divRef.current) return;

    const div = divRef.current;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { default: saveAs } = await import('file-saver');

      const clone = div.cloneNode(true);
      document.body.appendChild(clone);

      if (!(clone instanceof HTMLElement)) return;
      const canvas = await html2canvas(clone, { scale: 4 });

      document.body.removeChild(clone);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${imageName}.jpeg`);
        }
      });
    } catch (error) {
      showToast('error', '이미지 다운로드에 실패했습니다.');
    }
  };

  return {
    divRef,
    onImageDownload,
  };
}

export default useImageDownload;
