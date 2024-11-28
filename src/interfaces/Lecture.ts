import { LectureInfo } from 'api/timetable/entity';

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
  class_place?: string;
  id?: number;
}
