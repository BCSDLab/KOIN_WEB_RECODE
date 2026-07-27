import type { DepartmentContactDepartment } from 'api/departmentContact/entity';

export interface CategoryDetailViewProps {
  categoryName: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  departments: DepartmentContactDepartment[];
  isLoaded: boolean;
  updatedAt: string;
}
