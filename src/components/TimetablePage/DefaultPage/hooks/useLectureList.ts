import { timetable } from 'api';
import { useQuery } from 'react-query';
import showToast from 'utils/ts/showToast';

const SEMESTER_INFO_KEY = 'lecture';

const useLectureList = (semesterKey: string | null) => {
  const { data, status } = useQuery(
    [SEMESTER_INFO_KEY, semesterKey],
    ({ queryKey }) => timetable.getLectureList(queryKey[1] ?? '20191'),
    {
      onError: () => {
        showToast('error', '네트워크 연결을 확인해주세요.');
      },
      suspense: true,
      enabled: !!semesterKey,
    },
  );

  return {
    data,
    status,
  };
};

export default useLectureList;
