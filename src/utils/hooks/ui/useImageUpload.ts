import { useRef, useState } from 'react';
import { uploadFile, UploadDomain } from 'api/uploadFile';
import useTokenState from 'utils/hooks/state/useTokenState';

export type UploadErrorCode = '413' | '415' | '404' | '422' | 'network' | '401' | '403';

const ERROR_MESSAGES: Record<UploadErrorCode, string> = {
  '413': '10MB 이하의 파일만 업로드할 수 있습니다.',
  '415': '지원하지 않는 파일 형식입니다.',
  '404': '업로드 경로를 찾을 수 없습니다. 잠시 후 다시 시도해주세요.',
  '422': '이미지 처리에 실패했습니다. 다른 이미지를 선택해주세요.',
  network: '네트워크 연결을 확인해주세요.',
  '401': '로그인이 필요합니다. 다시 로그인해주세요.',
  '403': '파일 업로드 권한이 없습니다.',
};

export class UploadError extends Error {
  constructor(
    public code: UploadErrorCode,
    message?: string,
  ) {
    super(message ?? ERROR_MESSAGES[code]);
    this.name = 'UploadError';
  }
}

const MAX_SIZE = 1024 * 1024 * 10;

interface UseImageUploadOptions {
  maxLength?: number;
  domain: UploadDomain;
  resize?: (file: File) => Promise<Blob>;
}

export default function useImageUpload({ maxLength = 3, domain, resize }: UseImageUploadOptions) {
  const token = useTokenState();
  const [imageFile, setImageFile] = useState<string[]>([]);
  const imgRef = useRef<HTMLInputElement>(null);

  const saveImgFile = async (): Promise<string[]> => {
    const files = imgRef.current?.files;
    if (!files || !files.length) return imageFile;

    if (imageFile.length + files.length > maxLength) {
      throw new UploadError('413', `파일은 ${maxLength}개까지 등록할 수 있습니다.`);
    }

    const allFiles = Array.from(files);
    const onlyImages = allFiles.filter((file) => file.type.startsWith('image/'));

    if (onlyImages.length !== allFiles.length) {
      throw new UploadError('415');
    }

    const uploadedFiles: string[] = [...imageFile];

    for (const file of allFiles) {
      let processedFile: Blob = file;

      if (resize) {
        try {
          processedFile = await resize(file);
        } catch {
          throw new UploadError('422');
        }
      }

      if (processedFile.size > MAX_SIZE) {
        throw new UploadError('413');
      }

      const formData = new FormData();
      formData.append('multipartFile', processedFile);

      try {
        const data = await uploadFile(token, domain, formData);
        if (data.file_url) {
          uploadedFiles.push(data.file_url);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage.includes('415')) throw new UploadError('415');
        if (errorMessage.includes('404')) throw new UploadError('404');
        if (errorMessage.includes('403')) throw new UploadError('403');
        if (errorMessage.includes('Network Error')) throw new UploadError('network');
        throw new UploadError('401');
      }
    }

    setImageFile(uploadedFiles);
    return uploadedFiles;
  };

  return {
    imageFile,
    imgRef,
    saveImgFile,
    setImageFile,
  };
}
