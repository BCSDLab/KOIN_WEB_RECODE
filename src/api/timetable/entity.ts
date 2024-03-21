import { APIResponse } from 'interfaces/APIResponse';
import { LectureInfo, TimetableLectureInfo } from 'interfaces/Lecture';

export type SemesterInfo = {
  id: number;
  'semester': string;
};

export type VersionType = 'android' | 'timetable' | 'shuttle_bus_timetable' | 'express_bus_timetable' | 'city_bus_timetable';

export type VersionInfo = {
  id: string;
  version: string;
  type: string;
  created_at: string;
  updated_at: string;
};

export interface SemesterResponse extends APIResponse {
  [index: number]: SemesterInfo;
}

export interface LectureInfoResponse extends APIResponse {
  [index: number]: LectureInfo;
}

export interface TimetableInfoResponse extends APIResponse {
  semester: string;
  timetable: TimetableLectureInfo[];
}

export interface TimetableAddLectureResponse extends APIResponse {
  [index: number]: TimetableLectureInfo;
}

export interface TimetableAddLectureRequest {
  semester: string;
  timetable: [{
    class_time: number[];
    class_title: string;
    grades: string;
  }];
}

export interface TimetableRemoveLectureResponse extends APIResponse {
  [index: number]: TimetableLectureInfo;
}

export interface VersionInfoResponse extends APIResponse {
  id: string;
  version: string;
  type: string;
  created_at: string;
  updated_at: string;
}
