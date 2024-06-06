import { type APIResponse } from 'interfaces/APIResponse';
import { type Dining } from 'interfaces/Cafeteria';

export interface DiningResponseType extends APIResponse {
  [index: number]: Dining;
}
