import { type APIResponse } from 'interfaces/APIResponse';
import { type CafeteriaMenu } from 'interfaces/Cafeteria';

export interface CafeteriaListResponse extends APIResponse {
  [index: number]: CafeteriaMenu;
}
