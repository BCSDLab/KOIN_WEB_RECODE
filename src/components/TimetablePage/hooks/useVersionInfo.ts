import { useSuspenseQuery } from '@tanstack/react-query';
import { timetable } from 'api';

const useVersionInfo = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['timetable'],
    queryFn: () => timetable.getVersion('timetable'),

  });

  return {
    data,
  };
};

export default useVersionInfo;

// import { useSuspenseQuery } from '@tanstack/react-query';
// import { timetable } from 'api';
// import { VersionType } from 'api/timetable/entity';

// const useVersionInfo = () => {
//   const { data } = useSuspenseQuery({

//     queryKey: ['timetable'],
//     queryFn: async ({ queryKey }) => {
//       const params:VersionType = queryKey[0];

//       timetable.getVersion(params);
//     },
//   });

//   return {
//     data,
//   };
// };

// export default useVersionInfo;
