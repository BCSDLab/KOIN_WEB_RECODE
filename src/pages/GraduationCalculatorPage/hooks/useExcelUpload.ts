import { GraduationExcelUploadForPost } from 'pages/GraduationCalculatorPage/ts/types';
import { DragEvent } from 'react';
import usePostGraduationExcel from 'pages/GraduationCalculatorPage/hooks/usePostGraduationExcel';
import showToast from 'utils/ts/showToast';
import { useQueryClient } from '@tanstack/react-query';

export function useExcelUpload() {
  const queryClient = useQueryClient();
  const { mutate } = usePostGraduationExcel();

  const handleFile = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    mutate(formData as unknown as GraduationExcelUploadForPost, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['generalEducation'] });
        queryClient.invalidateQueries({ queryKey: ['my_semester'] });
        queryClient.invalidateQueries({ queryKey: ['creditsByCourseType'] });
        showToast('success', '엑셀 파일이 성공적으로 업로드되었습니다.');
      },
      onError: () => {
        showToast('error', '엑셀 파일 업로드에 실패했습니다. 다시 시도해주세요.');
      },
    });
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
