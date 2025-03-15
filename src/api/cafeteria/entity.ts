import { APIResponse } from 'interfaces/APIResponse';
import { Dining } from 'static/cafeteria';

export interface DiningResponseType extends APIResponse {
  [index: number]: Dining;
}
