import { APIResponse } from 'interfaces/APIResponse';

export type DepartmentContactCategory =
  | 'ACADEMIC'
  | 'STUDENT_SUPPORT'
  | 'EMPLOYMENT'
  | 'INTERNATIONAL'
  | 'FACILITY'
  | 'OTHER';

export const DEPARTMENT_CONTACT_CATEGORIES: DepartmentContactCategory[] = [
  'ACADEMIC',
  'STUDENT_SUPPORT',
  'EMPLOYMENT',
  'INTERNATIONAL',
  'FACILITY',
  'OTHER',
];

export interface DepartmentContact {
  task: string;
  phone_number: string;
}

export interface DepartmentContactDepartment {
  name: string;
  is_single_contact: boolean;
  contacts: DepartmentContact[];
}

export interface DepartmentContactCategoryGroup {
  category: DepartmentContactCategory;
  category_name: string;
  departments: DepartmentContactDepartment[];
}

export interface DepartmentContactsRequest {
  [key: string]: unknown;
  keyword?: string;
}

export interface DepartmentCategoryContactsRequest {
  [key: string]: unknown;
  keyword?: string;
}

export interface DepartmentContactsResponse extends APIResponse {
  updated_at: string;
  categories: DepartmentContactCategoryGroup[];
}

export interface DepartmentCategoryContactsResponse extends APIResponse {
  updated_at: string;
  category: DepartmentContactCategory;
  category_name: string;
  departments: DepartmentContactDepartment[];
}
