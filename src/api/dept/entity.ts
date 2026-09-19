export interface Dept {
  curriculum_link: string;
  dept_nums: string[];
  name: string;
}

export interface DeptMajor {
  department: string;
  majors: string[];
}

export type DeptListResponse = Dept[];

export type DeptMajorResponse = DeptMajor[];
