import { dept } from 'api';
import { useQuery } from 'react-query';

const DEPT_KEY = 'dept';

const useDeptList = () => {
  const { data } = useQuery(
    DEPT_KEY,
    dept.default,
    {
      suspense: true,
      useErrorBoundary: false,
    },
  );

  return {
    data,
  };
};

export default useDeptList;
