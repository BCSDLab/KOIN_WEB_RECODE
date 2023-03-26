import { useState } from 'react';
import showToast from 'utils/ts/showToast';

const useClickArrow = () => {
  const [imgIndx, setImgIndx] = useState(0);
  const clickLeftArrow = () => {
    if (imgIndx === 0) {
      showToast('info', '첫 이미지입니다.');
    } else {
      setImgIndx(imgIndx - 1);
    }
  };
  const clickRightArrow = (length: number | undefined) => {
    if (length && (imgIndx >= length - 1)) {
      showToast('info', '마지막 이미지입니다.');
    } else {
      setImgIndx(imgIndx + 1);
    }
  };

  return { imgIndx, clickLeftArrow, clickRightArrow };
};

export default useClickArrow;
