import type { APIResponse } from 'interfaces/APIResponse';

export interface HotClubsResponse extends APIResponse {
  name: string;
  image_url: string;
}
