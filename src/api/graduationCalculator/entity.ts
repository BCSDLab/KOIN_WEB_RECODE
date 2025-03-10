import { APIResponse } from 'interfaces/APIResponse';

export interface GraduationAgree extends APIResponse { }

export interface GeneralEducationArea {
  course_type: string;
  required_credit: number;
  completed_credit: number;
  course_names: string[];
}

export interface GeneralEducationResponse extends APIResponse {
  general_education_area: GeneralEducationArea[];
}

export interface Semester {
  year: number;
  term: string;
}

export interface LectureInfo {
  id: number;
  code: string;
  name: string;
  professor?: string;
  grades: string;
  department: string;
}

export interface CourseTypeResponse extends APIResponse {
  semester: string;
  lectures: LectureInfo[];
}

export interface GraduationExcelUploadResponse extends APIResponse { }

export interface GraduationExcelUploadRequest {
  file: File;
}

export type GradesByCourseType = {
  courseType: string;
  requiredGrades: number;
  grades: number;
};

export interface GradesByCourseTypeResponse {
  course_types: GradesByCourseType[];
}
