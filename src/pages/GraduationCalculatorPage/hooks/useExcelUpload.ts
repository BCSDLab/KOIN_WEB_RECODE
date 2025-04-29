import { GraduationExcelUploadForPost } from 'pages/GraduationCalculatorPage/ts/types';
import { DragEvent } from 'react';
import usePostGraduationExcel from 'pages/GraduationCalculatorPage/hooks/usePostGraduationExcel';
import showToast from 'utils/ts/showToast';
import { useQueryClient } from '@tanstack/react-query';
import useLogger from 'utils/hooks/analytics/useLogger';

export function useExcelUpload() {
  const queryClient = useQueryClient();
  const { mutate } = usePostGraduationExcel();
  const logger = useLogger();

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
    logger.actionEventClick({
      team: 'USER',
      event_label: 'graduation_calculator_add_excel',
      value: '엑셀파일 추가_드래그&드롭',
      event_category: 'file_upload',
    });
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    logger.actionEventClick({
      team: 'USER',
      event_label: 'graduation_calculator_add_excel',
      value: '엑셀파일 추가_경로 지정',
      event_category: 'file_upload',
    });
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  return { handleFileUpload, handleDrop, handleDragOver };
}
