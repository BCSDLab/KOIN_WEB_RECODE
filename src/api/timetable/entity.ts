import { APIResponse } from 'interfaces/APIResponse';
import { LectureInfo } from 'interfaces/Lecture';

export type SemesterInfo = {
  id: number;
  'semester': string;
};

export interface SemesterResponse extends APIResponse {
  [index: number]: SemesterInfo;
}

export interface LectureInfoResponse extends APIResponse {
  [index: number]: LectureInfo;
}
