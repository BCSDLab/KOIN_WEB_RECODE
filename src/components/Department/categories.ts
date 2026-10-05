import BackpackIcon from 'assets/svg/department/backpack-icon.svg';
import BuildingIcon from 'assets/svg/department/building-icon.svg';
import CircleEllipsisIcon from 'assets/svg/department/circle-ellipsis-icon.svg';
import GlobalIcon from 'assets/svg/department/global-icon.svg';
import SchoolIcon from 'assets/svg/department/school-icon.svg';
import SuitIcon from 'assets/svg/department/suit-icon.svg';

import type { DepartmentCategoryMenuItem } from './types';

export const DEPARTMENT_CATEGORIES: DepartmentCategoryMenuItem[] = [
  { category: 'ACADEMIC', title: '학사 / 수업', Icon: BackpackIcon },
  { category: 'STUDENT_SUPPORT', title: '학생지원 / 행정', Icon: SchoolIcon },
  { category: 'EMPLOYMENT', title: '취업 / 현장실습', Icon: SuitIcon },
  { category: 'INTERNATIONAL', title: '국제 / 교환학생', Icon: GlobalIcon },
  { category: 'FACILITY', title: '시설 / 생활', Icon: BuildingIcon },
  { category: 'OTHER', title: '기타 기관', Icon: CircleEllipsisIcon },
];
