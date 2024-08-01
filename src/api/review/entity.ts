import { APIResponse } from 'interfaces/APIResponse';

export interface ReviewRequest extends APIResponse {
  rating: number;
  content: string;
  image_urls: string[];
  menu_names: string[];
}

export interface UploadImage extends APIResponse {
  file_urls: string;
}
