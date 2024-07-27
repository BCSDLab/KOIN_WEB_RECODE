import { APIResponse } from 'interfaces/APIResponse';
import { Dining } from 'interfaces/Cafeteria';

export interface DiningResponseType extends APIResponse {
  [index: number]: Dining;
}
