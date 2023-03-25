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

export interface TimeTableLectureInfo {
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

export interface TimeTableDayLectureInfo {
  name: string;
  start: number;
  end: number;
  lecture_class: string;
  professor: string;
  index: number;
}
