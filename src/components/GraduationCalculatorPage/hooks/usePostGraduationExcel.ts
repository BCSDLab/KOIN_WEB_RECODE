import { isKoinError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadGraduationExcel } from 'api/graduationCalculator';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import { GraduationExcelUploadForPost } from 'components/GraduationCalculatorPage/ts/types';

const usePostGraduationExcel = () => {
  const token = useTokenState();
  const queryClient = useQueryClient();

  const { mutate, error } = useMutation({
    mutationFn: async (
      data: GraduationExcelUploadForPost,
    ) => uploadGraduationExcel(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['graduation'] });
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      }
    },
  });

  return { mutate, error };
};

export default usePostGraduationExcel;
