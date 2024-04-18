import { useQuery } from '@tanstack/react-query';
import { dept } from 'api';
import showToast from 'utils/ts/showToast';

const useDeptList = () => {
  const { data, error } = useQuery(
    {
      queryKey: ['dept'],
      queryFn: dept.default,

    },
  );

  if (error) {
    showToast('error', '네트워크 연결을 확인해주세요.');
  }

  return { data };
};

export default useDeptList;
