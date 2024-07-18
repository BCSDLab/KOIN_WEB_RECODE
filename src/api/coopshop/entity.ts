import { type APIResponse } from 'interfaces/APIResponse';
import { type Dining } from 'interfaces/Cafeteria';

export interface CoopshopCafeteriaType extends APIResponse {
  [index: number]: Dining;
}
