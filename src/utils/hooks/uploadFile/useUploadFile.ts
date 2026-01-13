import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { getPresignedUrl, uploadToS3 } from 'api/uploadFile';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import type { FileData, UploadDomain } from 'api/uploadFile/entity';

interface UploadFileParams {
  domain: UploadDomain;
  file: File | Blob;
}

const useUploadFile = () => {
  const token = useTokenState();

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: async ({ domain, file }: UploadFileParams) => {
      const fileName = file instanceof File && file.name ? file.name : 'blob';
      const fileData: FileData = {
        content_length: file.size,
        content_type: file.type || 'application/octet-stream',
        file_name: fileName,
      };

      const presignedResponse = await getPresignedUrl(token, domain, fileData);

      if (!presignedResponse.pre_signed_url || !presignedResponse.file_url || !presignedResponse.expiration_date) {
        throw new Error('업로드에 필요한 presigned URL을 받아오지 못했습니다.');
      }

      await uploadToS3(presignedResponse.pre_signed_url, file);

      return {
        file_url: presignedResponse.file_url,
        expiration_date: presignedResponse.expiration_date,
      };
    },
    onError: (err) => {
      if (isKoinError(err)) {
        showToast('error', err.message);
      } else {
        sendClientError(err);
        showToast('error', '파일 업로드에 실패했습니다.');
      }
    },
  });

  return {
    uploadFile: mutateAsync,
    isPending,
    isError,
    error,
  };
};

export default useUploadFile;
