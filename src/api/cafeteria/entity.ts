import type { Dining } from 'api/dinings/entity';
import type { APIResponse } from 'interfaces/APIResponse';

export interface DiningResponseType extends APIResponse, Record<number, Dining> {}

export interface SoldoutReportRequest {
  image_url: string;
}

export interface SoldoutReportResponse extends APIResponse {
  report_id: number;
  status: 'PENDING';
  created_at: string;
}
