import { APIResponse } from 'interfaces/APIResponse';
import { LectureInfo, TimetableLectureInfo } from 'interfaces/Lecture';

export type SemesterInfo = {
  id: number;
  semester: string;
};

export type TimetableFrameInfo = {
  id: number;
  timetable_name: string;
  is_main: boolean;
};

export type VersionType = 'android' | 'timetable' | 'shuttle_bus_timetable' | 'express_bus_timetable' | 'city_bus_timetable';

export type VersionInfo = {
  id: string;
  version: string;
  type: string;
  created_at: string;
  updated_at: string;
};

export type SemesterResponse = SemesterInfo[];

export type LectureInfoResponse = LectureInfo[];

export interface TimetableInfoResponse extends APIResponse {
  semester: string;
  timetable: TimetableLectureInfo[];
}

export type TimetableAddLectureResponse = TimetableLectureInfo[];

export interface TimetableAddLectureRequest {
  semester: string;
  timetable: [{
    class_time: number[];
    class_title: string;
    grades: string;
  }];
}

export type TimetableRemoveLectureResponse = TimetableLectureInfo[];

export interface VersionInfoResponse extends APIResponse {
  id: string;
  version: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface SemesterCheckResponse extends APIResponse {
  user_id: number;
  semesters: string[];
}

export type TimetableFrameListResponse = TimetableFrameInfo[];

export type AddTimetableFrameResponse = TimetableFrameInfo;

export interface AddTimetableFrameRequest {
  semester: string;
}

export interface UpdateTimetableFrameRequest {
  name: string,
  is_main: boolean,
}

export interface DeleteTimetableFrameResponse extends APIResponse { }
