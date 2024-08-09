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

export interface TimetableLectureInfoV2Response extends APIResponse {
  timetable_frame_id: number;
  timetable: TimetableDetailInfo[];
  grades: number;
  total_grades: number;
}

export interface TimetableDetailInfo {
  id: number;
  regular_number: string;
  code: string;
  design_score: string;
  class_time: number[];
  class_place: string;
  memo: string;
  grades: string;
  class_title: string;
  lecture_class: string;
  target: string;
  professor: string;
  department: string;
}

export interface AddTimetableLectureV2Request {
  timetable_frame_id: number;
  timetable_lecture: [{
    class_title: string;
    class_time: number[];
    class_place: string;
    professor: string;
    grades: string;
    memo: string;
    lecture_id: number;
  }];
}

export interface UpdateTimetableLectureV2Request {
  timetable_frame_id: number;
  timetable_lecture: [{
    id: number;
    lecture_id: number;
    class_title: string;
    class_time: number[];
    class_place: string;
    '강의 교수': string;
    grades: string;
    memo: string;
  }];
}

export interface DeleteTimetableLectureV2Request {
  id: number;
}
