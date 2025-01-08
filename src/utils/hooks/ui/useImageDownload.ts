import React from 'react';
import saveAs from 'file-saver';
import html2canvas from 'html2canvas';

function useImageDownload() {
  const divRef = React.useRef<HTMLDivElement>(null);
  const onImageDownload = async (imageName: string) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const canvas = await html2canvas(div, { scale: 4 });
    canvas.toBlob((blob) => {
      if (blob !== null) {
        saveAs(blob, `${imageName}.jpeg`);
      }
    });
  };

  return {
    divRef,
    onImageDownload,
  };
}

export default useImageDownload;
