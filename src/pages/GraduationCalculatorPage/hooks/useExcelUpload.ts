import { GraduationExcelUploadForPost } from 'pages/GraduationCalculatorPage/ts/types';
import { DragEvent } from 'react';
import usePostGraduationExcel from 'pages/GraduationCalculatorPage/hooks/usePostGraduationExcel';

export function useExcelUpload() {
  const { mutate } = usePostGraduationExcel();

  const handleFile = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    mutate(formData as unknown as GraduationExcelUploadForPost);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  return { handleFileUpload, handleDrop, handleDragOver };
}
