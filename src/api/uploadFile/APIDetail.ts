import axios from 'axios';
import { HTTP_METHOD } from 'interfaces/APIRequest';
import APIClient from 'utils/ts/apiClient';
import { FileData, UploadURLResponse } from './entity';

const API_DOMAIN = process.env.NEXT_PUBLIC_API_PATH ?? '';

type UploadableFile = File | Blob;

export const getPresignedUrl = (domain: string, fileData: FileData, path: string, authorization?: string) =>
  APIClient.request({
    method: HTTP_METHOD.POST,
    path: path,
    baseURL: domain,
    data: fileData,
    headers: authorization ? { Authorization: `Bearer ${authorization}` } : {},
    response: {} as UploadURLResponse,
  });

export const uploadToS3 = async (presignedUrl: string, file: Blob) => {
  await axios.put(presignedUrl, file, {
    headers: { 'Content-Type': file.type },
    withCredentials: false,
  });
};

export const uploadFile = async (
  domain: string,
  file: UploadableFile,
  path: string,
  authorization?: string,
): Promise<{
  file_url: string;
  expiration_date: string;
}> => {
  const fileName = file instanceof File && file.name ? file.name : 'blob';
  const fileData: FileData = {
    content_length: file.size,
    content_type: file.type || 'application/octet-stream',
    file_name: fileName,
  };

  const response = await getPresignedUrl(domain, fileData, path, authorization);

  if (!response.pre_signed_url || !response.file_url || !response.expiration_date) {
    throw new Error('업로드에 필요한 presigned URL을 받아오지 못했습니다.');
  }

  const { pre_signed_url, file_url, expiration_date } = response;

  try {
    await uploadToS3(pre_signed_url, file);
  } catch {
    throw new Error('업로드에 실패했습니다.');
  }

  return { file_url, expiration_date };
};

const getFileNameFromType = (type: string | undefined) => {
  if (!type) return 'blob';
  const extension = type.split('/')[1] || 'blob';
  return `upload.${extension}`;
};

const uploadWithPresignedUrl = async (authorization: string, formData: FormData, path: string) => {
  const file = formData.get('multipartFile');
  if (!(file instanceof Blob)) {
    throw new Error('File not found in formData');
  }

  const normalizedFile =
    file instanceof File && file.name
      ? file
      : new File([file], getFileNameFromType(file.type), { type: file.type || 'application/octet-stream' });

  return uploadFile(API_DOMAIN, normalizedFile, path, authorization);
};

export const uploadShopFile = async (authorization: string, formData: FormData) =>
  uploadWithPresignedUrl(authorization, formData, 'SHOPS/upload/url');

export const uploadLostItemFile = async (authorization: string, formData: FormData) =>
  uploadWithPresignedUrl(authorization, formData, 'LOST_ITEMS/upload/url');

export const uploadClubFile = async (authorization: string, formData: FormData) =>
  uploadWithPresignedUrl(authorization, formData, 'CLUB/upload/url');
