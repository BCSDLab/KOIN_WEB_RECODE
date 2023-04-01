import { useState } from 'react';
import showToast from 'utils/ts/showToast';

const useClickArrow = () => {
  const [imgIndex, setImgIndx] = useState(0);
  const clickLeftArrow = () => {
    if (imgIndex === 0) {
      showToast('info', '첫 이미지입니다.');
    } else {
      setImgIndx(imgIndex - 1);
    }
  };
  const clickRightArrow = (length: number | undefined) => {
    if (length && (imgIndex >= length - 1)) {
      showToast('info', '마지막 이미지입니다.');
    } else {
      setImgIndx(imgIndex + 1);
    }
  };

  return { imgIndex, clickLeftArrow, clickRightArrow };
};

export default useClickArrow;
