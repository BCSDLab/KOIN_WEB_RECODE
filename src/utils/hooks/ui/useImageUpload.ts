import { useRef, useState } from 'react';
import showToast from 'utils/ts/showToast';
import useTokenState from 'utils/hooks/state/useTokenState';
import { uploadLostItemFile, uploadShopFile } from 'api/uploadFile';

// 정의할 수 있는 에러 타입
export type UploadError = '413' | '415' | '404' | '422' | 'networkError' | '401' | '';

const MAXSIZE = 1024 * 1024 * 10;

interface UseImageUploadOptions {
  maxLength?: number;
  uploadFn: typeof uploadShopFile | typeof uploadLostItemFile;
}

/* eslint-disable */
export default function useImageUpload({
  maxLength = 3,
  uploadFn,
}: UseImageUploadOptions) {
  const token = useTokenState();
  const [imageFile, setImageFile] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<UploadError>('');
  const imgRef = useRef<HTMLInputElement>(null);

  const saveImgFile = async () => {
    const files = imgRef.current?.files;
    // imageFile.length + files.length을 통해 저장된 이미지 + 새로 추가할 이미지의 개수를 파악함
    if (files && (imageFile.length + files.length > maxLength)) {
      showToast('error', `파일은 ${maxLength}개까지 등록할 수 있습니다.`)
      return;
    }

    if (!files || !files.length) return;

    const uploadedFile: string[] = [...imageFile];
    const correctForm = new RegExp('(.*?)\\.(jpg|jpeg|gif|bmp|png|JPG|JPEG|GIF|BMP|PNG)$');

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];

      if (file.size > MAXSIZE) {
        setUploadError('413'); // 파일 사이즈가 너무 큰 경우
        return;
      }

      if (!correctForm.test(file.name)) {
        setUploadError('415'); // 지원하지 않는 타입 에러
        return;
      }

      const formData = new FormData();
      formData.append('multipartFile', file);

      try {
        const data = await uploadFn(token, formData);
        if (data.file_url) {
          uploadedFile.push(data.file_url);
        }
      } catch (error: any) {
        setImageFile([]);
        const errorMessage = error.toString();
        if (errorMessage.includes('415')) {
          setUploadError('415');
        } else if (errorMessage.includes('404')) {
          setUploadError('404');
        } else if (errorMessage.includes('422')) {
          setUploadError('422');
        } else if (errorMessage.includes('Network Error')) {
          setUploadError('networkError');
        } else {
          setUploadError('401');
        }
        return;
      }
    }

    setImageFile(uploadedFile);
    setUploadError('');

    return uploadedFile;
  };

  return {
    imageFile, imgRef, saveImgFile, uploadError, setImageFile
  };
}
