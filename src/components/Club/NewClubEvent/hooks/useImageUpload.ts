import { useRef, useState } from 'react';
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
export default function useImageUpload({ uploadFn }: UseImageUploadOptions) {
  const token = useTokenState();
  const imgRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<UploadError>('');

  const saveImgFile = async (): Promise<string[] | undefined> => {
    const files = imgRef.current?.files;
    if (!files || !files.length) return;

    const correctForm = /\.(jpg|jpeg|gif|bmp|png)$/i;
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];

      if (file.size > MAXSIZE) {
        setUploadError('413');
        return;
      }

      if (!correctForm.test(file.name)) {
        setUploadError('415');
        return;
      }

      const formData = new FormData();
      formData.append('multipartFile', file);

      try {
        const data = await uploadFn(token, formData);
        if (data.file_url) {
          uploadedUrls.push(data.file_url);
        }
      } catch (error: any) {
        const errorMessage = error.toString();
        setUploadError(
          errorMessage.includes('415') ? '415'
            : errorMessage.includes('404') ? '404'
            : errorMessage.includes('422') ? '422'
            : errorMessage.includes('Network Error') ? 'networkError'
            : '401'
        );
        return;
      }
    }

    setUploadError('');
    return uploadedUrls;
  };

  return { imgRef, saveImgFile, uploadError };
}
