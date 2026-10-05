import type { Dining } from 'api/dinings/entity';
import type { APIResponse } from 'interfaces/APIResponse';

export interface DiningResponseType extends APIResponse, Record<number, Dining> {}
