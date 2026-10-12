import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { cafeteriaMutations } from 'api/cafeteria/mutations';
import showMobileToast from 'components/feedback/Toast/showMobileToast';

const useCreateSoldoutReport = () => {
  const mutation = cafeteriaMutations.createSoldoutReport();

  const { mutate, isPending } = useMutation({
    ...mutation,
    onError: (error) => {
      if (isKoinError(error)) {
        showMobileToast('error', error.message || '품절 제보에 실패했습니다.');
      } else {
        sendClientError(error);
        showMobileToast('error', '품절 제보에 실패했습니다.');
      }
    },
  });

  return { mutate, isPending };
};

export default useCreateSoldoutReport;
