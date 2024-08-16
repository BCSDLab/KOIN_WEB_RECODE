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
  design_score: string;
  class_time: Array<number>;
}

// export interface LectureInfo {
//   id: number;
//   regular_number: string;
//   code: string;
//   design_score: string;
//   class_time: Array<number>;
//   class_place: string | null;
//   memo: string | null;
//   grades: string;
//   class_title: string;
//   lecture_class: string;
//   target: string;
//   professor: string;
//   department: string;
// }

export interface TimetableLectureInfo {
  id: number;
  regular_number: string;
  code: string;
  design_score: string;
  class_time: Array<number>;

  class_title: string;
  lecture_class: string;
  target: string;
  grades: string;
  professor: string;
  department: string;
}

export interface TimetableLectureInfoV2 {
  id: number;
  regular_number: string;
  code: string;
  design_score: string;
  class_time: Array<number>;
  class_place: string;
  memo: string;
  grades: string;
  class_title: string;
  lecture_class: string;
  target: string;
  professor: string;
  department: string;
}

export interface TimetableInfoFromLocalStorage {
  [key: string]: LectureInfo[];
}

export interface TimetableInfoFromLocalStorageV2 {
  [key: string]: LectureInfo[];
}

export interface TimetableDayLectureInfo {
  name: string;
  start: number;
  end: number;
  lecture_class: string;
  professor: string;
  index: number;
  id: number;
}
