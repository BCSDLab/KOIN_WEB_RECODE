import { useState } from 'react';
import usePostGraduationExcel from 'pages/GraduationCalculatorPage/hooks/usePostGraduationExcel';
import { GraduationExcelUploadForPost } from 'pages/GraduationCalculatorPage/ts/types';

export function useExcelUpload() {
  const [fileName, setFileName] = useState<string | null>(null);
  const { mutate } = usePostGraduationExcel();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const formData = new FormData();
    formData.append('file', file);

    mutate(formData as unknown as GraduationExcelUploadForPost);
  };

  return { handleFileUpload, fileName };
}
