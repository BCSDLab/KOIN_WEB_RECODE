import { APIResponse } from 'interfaces/APIResponse';

export interface UploadImage extends APIResponse {
  file_url: string;
}

export interface FileData {
  content_length: number;
  content_type: string;
  file_name: string;
}

export interface UploadURLResponse extends APIResponse {
  pre_signed_url: string;
  file_url: string;
  expiration_date: string;
}
