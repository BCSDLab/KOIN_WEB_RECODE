import { timetable } from 'api';
import { useQuery } from 'react-query';
import showToast from 'utils/ts/showToast';

const SEMESTER_INFO_KEY = 'semester';

const useSemester = () => {
  const { data } = useQuery(
    SEMESTER_INFO_KEY,
    timetable.getSemesterInfoList,
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

export default useSemester;
