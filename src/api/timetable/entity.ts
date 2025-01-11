import { APIResponse } from 'interfaces/APIResponse';

export type Term = '1학기' | '여름학기' | '2학기' | '겨울학기';

export type Semester = {
  year: number;
  term: Term;
};

export type SemestersResponse = Semester[];

export interface SemesterCheckResponse extends APIResponse {
  user_id: number;
  semesters: Semester[];
}

export interface Lecture {
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
  lecture_infos: LectureInfo[];
}

export type LecturesResponse = Lecture[];

export type TimetableFrameInfo = {
  id: number | null;
  name: string;
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

// V2-시간표
// 강의 관련 요청 / 응답

// export interface TimetableLectureInfoResponse extends APIResponse {
//   timetable_frame_id: number;
//   timetable: MyLectureInfo[];
//   grades: number;
//   total_grades: number;
// }

export interface EditTimetableLectureRequest {
  timetable_frame_id: number;
  timetable_lecture: MyLectureInfo[];
}

// export interface AddTimetableLectureRequest {
//   timetable_frame_id: number;
//   timetable_lecture: Omit<MyLectureInfo, 'id'>[];
// }

export interface DeleteTimetableLectureResponse extends APIResponse { }

// 시간표 프레임 관련 요청 / 응답
export type TimetableFrameListResponse = TimetableFrameInfo[];

export interface EditTimetableFrameRequest {
  name: string;
  is_main: boolean;
}

export type AddTimetableFrameRequest = Semester;

export interface DeleteTimetableFrameResponse extends APIResponse { }

export interface DeleteSemesterResponse extends APIResponse { }

export interface VersionInfoResponse extends APIResponse {
  id: number;
  version: string;
  type: string;
  created_at: string;
  updated_at: string;
}

// V3-정규 강의 수정
interface ClassPlace {
  class_place: string;
}

export interface TimetableRegularLecture {
  id: number;
  lecture_id: number;
  class_title: string;
  class_place: ClassPlace[];
}

export interface TimetableLectureRegularEditRequest {
  timetable_frame_id: number;
  timetable_lecture: TimetableRegularLecture;
}

export interface LectureCustomInfo {
  start_time: number;
  end_time: number;
  place: string;
}

export interface TimetableCustomLecture {
  id: number;
  class_title: string;
  lecture_infos: LectureCustomInfo[];
  professor: string;
}
export interface TimetableLectureCustomEditRequest {
  timetable_frame_id: number;
  timetable_lecture: TimetableCustomLecture;
}

// v3 - 정규 강의 생성

export interface AddLectureInfo {
  start_time: number;
  end_time: number;
  place: string;
}

export interface AddTimetableCustomLecture {
  class_title: string;
  lecture_infos: AddLectureInfo[];
  professor: string;
  grades?: string;
  memo?: string;
}
export interface AddTimetableLectureCustomRequest {
  timetable_frame_id: number;
  timetable_lecture: AddTimetableCustomLecture;
}
export interface AddTimetableLectureRegularRequest {
  timetable_frame_id: number;
  lecture_id: number;
}

export interface RollbackTimetableLectureRequest {
  timetable_lectures_id: number[];
}

export type LectureInfo = {
  day: number;
  start_time: number;
  end_time: number;
  place: string;
};

export interface MyLectureInfo {
  id: number;
  lecture_id: number;
  regular_number: string;
  code: string;
  design_score: string;
  lecture_infos: LectureInfo[];
  memo: string;
  grades: string;
  class_title: string;
  lecture_class: string;
  target: string;
  professor: string;
  department: string;
}

export interface TimetableLectureInfoResponse extends APIResponse {
  timetable_frame_id: number;
  timetable: MyLectureInfo[];
  grades: number;
  total_grades: number;
}

export type AddTimetableLecture =
  | { lecture_id: number }
  | { timetable_lecture: AddTimetableCustomLecture };
