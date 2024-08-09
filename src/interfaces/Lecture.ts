export interface LectureInfo {
  code: string;
  name: string;
  grades: string;
  lecture_class: string;
  regular_number: string;
  department: string;
  target: string;
  professor: string;
  design_score: string;
  class_time: Array<number>;
}

export interface TimetableLectureInfo {
  id: number;
  code: string;
  class_title: string;
  grades: string;
  lecture_class: string;
  regular_number: string;
  department: string;
  target: string;
  professor: string;
  design_score: string;
  class_time: Array<number>;
}

export interface TimetableInfoFromLocalStorage {
  [key: string]: LectureInfo[];
}

export interface TimetableDayLectureInfo {
  name: string;
  start: number;
  end: number;
  lecture_class: string;
  professor: string;
  index: number;
}

export interface TimetableLectureDetailInfoV2 {
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
