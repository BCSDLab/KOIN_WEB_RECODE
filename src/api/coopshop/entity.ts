import { type APIResponse } from 'interfaces/APIResponse';
import { type OriginalDining } from 'interfaces/Coopshop';

export interface CoopshopCafeteriaResponse extends APIResponse {
  data: OriginalDining;
}
