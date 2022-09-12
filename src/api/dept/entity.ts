import { APIResponse } from 'interfaces/APIResponse';

export type IDept = {
  'curriculum_link': string;
  'dept_nums': string[];
  'name': string;
};

export interface DeptListResponse extends APIResponse {
  [index: number]: IDept;
}
