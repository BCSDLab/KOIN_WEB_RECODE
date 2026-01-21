interface LectureInfo {
  lecture_code: string;
  lecture_name: string;
}

export interface Course {
  department: string;
  lecture_info: LectureInfo;
  class_number: string;
  grades: string;
  professor: string;
  regular_number: string;
  class_time: string;
  class_time_raw: number[];
}

export type CourseResponse = Course[];

export interface CourseRequestParams {
  name?: string;
  department?: string;
  year?: number;
  semester?: string;
}

interface PreCourseBase {
  class_time_raw: number[];
  grades: string;
}

export interface CustomPreCourse extends PreCourseBase {
  department: '-';
  lecture_info: null;
  class_number: null;
}

export interface NormalPreCourse extends PreCourseBase {
  department: string;
  lecture_info: LectureInfo;
  class_number: string;
}

export type PreCourse = CustomPreCourse | NormalPreCourse;
export type PreCourseResponse = PreCourse[];

export interface PreCourseRequestParams {
  timetable_frame_id: number;
}
