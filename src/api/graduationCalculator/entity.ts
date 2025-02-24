import { APIResponse } from 'interfaces/APIResponse';

export interface GraduationAgree extends APIResponse { }

export interface RequiredEducationArea {
  courseType: string;
  isCompleted: boolean;
  courseName: string | null;
}

export interface GeneralEducationResponse extends APIResponse {
  required_education_area: RequiredEducationArea[];
}

export interface Semester {
  year: number;
  term: string;
}

export interface LectureInfo {
  id: number;
  code: string;
  name: string;
  grades: string;
  department: string;
}

export interface CourseTypeResponse extends APIResponse {
  semester: string;
  lectures: LectureInfo[];
}
