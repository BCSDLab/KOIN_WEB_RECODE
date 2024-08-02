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
  '시간표프레임 id': number;
  '시간표 상세정보': TimetableDetailInfo[];
  '해당 학기 학점': number;
  '전체 학기 학점': number;
}

export interface TimetableDetailInfo {
  '시간표 id': number;
  '수강 정원': string;
  '과목 코드': string;
  design_score: string;
  class_time: number[];
  class_place: string;
  memo: string;
  '학점': string;
  '강의(커스텀) 이름': string;
  '분반': string;
  '대상': string;
  '강의 교수': string;
  '학부': string;
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
