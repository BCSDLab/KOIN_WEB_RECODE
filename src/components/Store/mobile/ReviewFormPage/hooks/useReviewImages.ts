import useImageUpload, { UploadError } from 'utils/hooks/ui/useImageUpload';
import showToast from 'utils/ts/showToast';

// 리뷰 사진 업로드(최대 3장). 업로드는 데스크톱 리뷰와 같은 유틸(SHOPS 도메인)을 쓴다
export const MAX_REVIEW_IMAGE_COUNT = 3;

export default function useReviewImages() {
  const { imageFile, imgRef, saveImgFile, setImageFile } = useImageUpload({
    maxLength: MAX_REVIEW_IMAGE_COUNT,
    domain: 'SHOPS',
  });

  const handleChangeImage = async () => {
    try {
      await saveImgFile();
    } catch (error) {
      showToast('error', error instanceof UploadError ? error.message : '사진 업로드에 실패했어요');
    } finally {
      if (imgRef.current) imgRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImageFile(imageFile.filter((_, i) => i !== index));
  };

  return { imageUrls: imageFile, imgRef, handleChangeImage, removeImage, setImageFile };
}
