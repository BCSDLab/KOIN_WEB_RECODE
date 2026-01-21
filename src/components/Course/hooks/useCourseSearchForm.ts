import React, { useState } from 'react';
import { CourseRequestParams } from 'api/course/entity';
import { Term } from 'api/timetable/entity';

interface UseCourseSearchFormOptions {
  initialYear: number;
  initialSemester: Term;
}

export default function useCourseSearchForm({ initialYear, initialSemester }: UseCourseSearchFormOptions) {
  const [formInputs, setFormInputs] = useState({
    name: '',
    department: '',
  });

  const [searchParams, setSearchParams] = useState<CourseRequestParams>({
    name: '',
    department: '',
    year: initialYear,
    semester: initialSemester,
  });

  const handleSearch = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    setSearchParams((prev) => ({
      ...prev,
      name: formInputs.name,
      department: formInputs.department,
    }));
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '(전체)' ? '' : e.target.value;
    setFormInputs((prev) => ({ ...prev, department: value }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInputs((prev) => ({ ...prev, name: e.target.value }));
  };

  return {
    formInputs,
    searchParams,
    handleSearch,
    handleDepartmentChange,
    handleNameChange,
  };
}
