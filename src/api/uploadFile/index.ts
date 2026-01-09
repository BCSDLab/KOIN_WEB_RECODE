import APIClient from 'utils/ts/apiClient';
import { GetPresignedUrl, UploadToS3 } from './APIDetail';
import type { FileData, UploadDomain } from './entity';

const getPresignedUrl = APIClient.of(GetPresignedUrl);

export async function uploadFile(
  authorization: string,
  domain: UploadDomain,
  formData: FormData,
): Promise<{ file_url: string; expiration_date: string }> {
  const file = formData.get('multipartFile');
  if (!(file instanceof Blob)) throw new Error('파일이 존재하지 않습니다.');

  const fileName = file instanceof File && file.name ? file.name : 'blob';
  const fileData: FileData = {
    content_length: file.size,
    content_type: file.type || 'application/octet-stream',
    file_name: fileName,
  };

  const response = await getPresignedUrl(authorization, domain, fileData);

  if (!response.pre_signed_url || !response.file_url || !response.expiration_date) {
    throw new Error('업로드에 필요한 presigned URL을 받아오지 못했습니다.');
  }

  try {
    await UploadToS3.execute(response.pre_signed_url, file);
  } catch {
    throw new Error('업로드에 실패했습니다.');
  }

  return {
    file_url: response.file_url,
    expiration_date: response.expiration_date,
  };
}
