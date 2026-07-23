import type { ComponentType, SVGProps } from 'react';
import type { DepartmentContactCategory, DepartmentContactCategoryGroup } from 'api/departmentContact/entity';

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface DepartmentCategoryMenuItem {
  category: DepartmentContactCategory;
  title: string;
  Icon: IconComponent;
}

export interface DepartmentViewProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  isSearching: boolean;
  categories: DepartmentCategoryMenuItem[];
  searchResultCategories: DepartmentContactCategoryGroup[];
  onCategoryClick: (category: DepartmentContactCategory, title: string) => void;
  updatedAt: string;
}
