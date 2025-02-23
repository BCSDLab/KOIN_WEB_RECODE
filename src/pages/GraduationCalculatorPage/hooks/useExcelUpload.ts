import usePostGraduationExcel from 'pages/GraduationCalculatorPage/hooks/usePostGraduationExcel';
import { GraduationExcelUploadForPost } from 'pages/GraduationCalculatorPage/ts/types';

export function useExcelUpload() {
  const { mutate } = usePostGraduationExcel();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    mutate(formData as unknown as GraduationExcelUploadForPost);
  };

  return { handleFileUpload };
}
