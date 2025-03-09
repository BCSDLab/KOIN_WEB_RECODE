import { APIResponse } from 'interfaces/APIResponse';

// v3-semester
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

// v3-lecture
export type LectureInfo = {
  day: number;
  start_time: number;
  end_time: number;
  place: string;
};

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

// v3-timetables-lecture
export interface MyLectureInfo {
  id: number;
  lecture_id: number | null;
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
  course_type?: string,
  general_education_area?: string,
}

export interface TimetableLectureInfoResponse extends APIResponse {
  timetable_frame_id: number;
  timetable: MyLectureInfo[];
  grades: number;
  total_grades: number;
}

export interface TimetableAllLectureResponse extends APIResponse {
  timetable: MyLectureInfo[];
}

interface ClassPlace {
  class_place: string;
}

export interface TimetableRegularLecture {
  id: number;
  lecture_id: number;
  class_title: string;
  class_places: ClassPlace[];
  course_type?: string;
  general_education_area?: string;
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

// v3-timetables-frame
export type TimetableFrameInfo = {
  id: number | null;
  name: string;
  is_main: boolean;
};

export interface DeleteTimetableLectureResponse extends APIResponse { }

export type TimetableFrameListResponse = TimetableFrameInfo[];

export interface EditTimetableFrameRequest {
  name: string;
  is_main: boolean;
}

export type AddTimetableFrameRequest = Semester;

export interface DeleteTimetableFrameResponse extends APIResponse { }

export interface DeleteSemesterResponse extends APIResponse { }

export type VersionType = 'android' | 'timetable' | 'shuttle_bus_timetable' | 'express_bus_timetable' | 'city_bus_timetable';

export interface VersionInfoResponse extends APIResponse {
  id: number;
  version: string;
  type: string;
  created_at: string;
  updated_at: string;
}
