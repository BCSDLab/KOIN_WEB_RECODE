import { Dining } from 'api/dinings/entity';
import { APIResponse } from 'interfaces/APIResponse';

export interface DiningResponseType extends APIResponse {
  [index: number]: Dining;
}
