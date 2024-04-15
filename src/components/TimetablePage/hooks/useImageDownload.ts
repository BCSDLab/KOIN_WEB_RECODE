import html2canvas from 'html2canvas';
import saveAs from 'file-saver';
import { TIMETABLE_ID } from 'components/TimetablePage/Timetable';

function useImageDownload() {
  const onImageDownload = async () => {
    const canvas = await html2canvas(document.getElementById(TIMETABLE_ID)!, { scale: 4 });
    canvas.toBlob((blob) => {
      if (blob !== null) {
        saveAs(blob, 'my-image-name.jpeg');
      }
    });
  };

  return {
    onImageDownload,
  };
}

export default useImageDownload;
