import { dept } from 'api';
import { useQuery } from 'react-query';
import showToast from 'utils/ts/showToast';

const DEPT_KEY = 'dept';

const useDeptList = () => {
  const { data } = useQuery(
    DEPT_KEY,
    dept.default,
    {
      onError: () => {
        showToast('error', '네트워크 연결을 확인해주세요.');
      },
      suspense: true,
    },
  );

  return {
    data,
  };
};

export default useDeptList;
