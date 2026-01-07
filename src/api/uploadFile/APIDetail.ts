import axios from 'axios';
import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import APIClient from 'utils/ts/apiClient';
import { FileData, UploadURLResponse } from './entity';

const API_DOMAIN = process.env.NEXT_PUBLIC_API_PATH ?? '';

type UploadableFile = File | Blob;

export class GetPresignedUrlRequest<R extends UploadURLResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  baseURL: string;

  data: FileData;

  response!: R;

  auth: boolean;

  headers: { [key: string]: string };

  constructor(domain: string, fileData: FileData, path: string, authorization?: string) {
    this.path = path;
    this.baseURL = domain;
    this.data = fileData;
    this.auth = !!authorization;
    this.headers = authorization ? { Authorization: `Bearer ${authorization}` } : {};
  }
}

export class FileUploader {
  static uploadToS3 = async (presignedUrl: string, file: Blob) => {
    try {
      await axios.put(presignedUrl, file, {
        headers: { 'Content-Type': file.type },
        withCredentials: false,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error('서버 응답 오류가 발생했습니다.');
      }
      throw new Error('오류가 발생했습니다.');
    }
  };

  static uploadFile = async (
    domain: string,
    file: UploadableFile,
    path: string,
    authorization?: string,
  ): Promise<{ file_url: string; expiration_date: string }> => {
    const fileName = file instanceof File && file.name ? file.name : 'blob';
    const fileData: FileData = {
      content_length: file.size,
      content_type: file.type || 'application/octet-stream',
      file_name: fileName,
    };

    const request = new GetPresignedUrlRequest(domain, fileData, path, authorization);
    const response = await APIClient.request(request);

    if (!response.pre_signed_url || !response.file_url || !response.expiration_date) {
      throw new Error('업로드에 필요한 presigned URL을 받아오지 못했습니다.');
    }

    try {
      await this.uploadToS3(response.pre_signed_url, file);
    } catch {
      throw new Error('업로드에 실패했습니다.');
    }

    return {
      file_url: response.file_url,
      expiration_date: response.expiration_date,
    };
  };

  static uploadWithPresignedUrl = async (authorization: string, formData: FormData, path: string) => {
    const file = formData.get('multipartFile');
    if (!(file instanceof Blob)) throw new Error('파일이 존재하지 않습니다.');

    return this.uploadFile(API_DOMAIN, file, path, authorization);
  };
}

export const uploadShopFile = async (authorization: string, formData: FormData) =>
  FileUploader.uploadWithPresignedUrl(authorization, formData, 'SHOPS/upload/url');

export const uploadLostItemFile = async (authorization: string, formData: FormData) =>
  FileUploader.uploadWithPresignedUrl(authorization, formData, 'LOST_ITEMS/upload/url');

export const uploadClubFile = async (authorization: string, formData: FormData) =>
  FileUploader.uploadWithPresignedUrl(authorization, formData, 'CLUB/upload/url');
