import { APIResponse } from 'interfaces/APIResponse';

export interface UploadImage extends APIResponse {
  file_url: string;
}
