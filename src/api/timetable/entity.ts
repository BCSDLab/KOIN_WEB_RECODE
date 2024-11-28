import { APIResponse } from 'interfaces/APIResponse';

export type SemesterInfo = {
  id: number;
  semester: string;
};

export interface LectureInfo {
  id: number;
  code: string;
  name: string;
  grades: string;
  lecture_class: string;
  regular_number: string;
  department: string;
  target: string;
  professor: string;
  is_english?: string;
  design_score: string;
  is_elearning?: string;
  class_time: Array<number>;
}

export type LectureSchedule = {
  class_time: number[],
  class_place?: string,
};

export interface MyLectureInfo {
  id: number;
  lecture_id: number;
  regular_number: string;
  code: string;
  design_score: string;
  class_infos: LectureSchedule[];
  memo: string;
  grades: string;
  class_title: string;
  lecture_class: string;
  target: string;
  professor: string;
  department: string;
}

export interface TimetableLectureInfo {
  id: number;
  lecture_id?: number;
  class_title: string | null;
  class_infos: LectureSchedule[] | null;
  professor?: string | null;
  grades?: string;
  memo?: string;
}

export type TimetableFrameInfo = {
  id: number | null;
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

// V1-시간표
export type SemesterResponse = SemesterInfo[];

export type LectureInfoResponse = LectureInfo[];

export interface SemesterCheckResponse extends APIResponse {
  user_id: number;
  semesters: string[];
}

// V2-시간표
// 강의 관련 요청 / 응답
export interface TimetableLectureInfoResponse extends APIResponse {
  timetable_frame_id: number;
  timetable: MyLectureInfo[];
  grades: number;
  total_grades: number;
}

export interface EditTimetableLectureRequest {
  timetable_frame_id: number;
  timetable_lecture: TimetableLectureInfo[];
}

export interface AddTimetableLectureRequest {
  timetable_frame_id: number;
  timetable_lecture: Omit<TimetableLectureInfo, 'id'>[];
}

export interface DeleteTimetableLectureResponse extends APIResponse { }

// 시간표 프레임 관련 요청 / 응답
export type TimetableFrameListResponse = TimetableFrameInfo[];

export interface EditTimetableFrameRequest {
  timetable_name: string;
  is_main: boolean;
}

export interface AddTimetableFrameRequest {
  semester: string;
  timetable_name?: string;
}

export interface DeleteTimetableFrameResponse extends APIResponse { }

export interface DeleteSemesterResponse extends APIResponse { }

export interface VersionInfoResponse extends APIResponse {
  id: number;
  version: string;
  type: string;
  created_at: string;
  updated_at: string;
}
