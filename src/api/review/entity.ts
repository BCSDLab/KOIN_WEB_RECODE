import type { Review } from 'api/store/entity';
import type { APIResponse } from 'interfaces/APIResponse';

export type ReviewData = Omit<Review, 'is_min'>;

export interface ReviewResponse extends APIResponse, ReviewData {}

export interface ReviewRequest extends APIResponse {
  rating: number;
  content: string;
  image_urls: string[];
  menu_names: string[];
}
