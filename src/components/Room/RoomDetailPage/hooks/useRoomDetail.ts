import { useQuery } from '@tanstack/react-query';
import { getRoomDetailInfo } from 'api/room';

const useRoomDetail = (id: string) => {
  const { data: roomDetail } = useQuery({
    queryKey: ['roomDetail', id],
    queryFn: async ({ queryKey }) => {
      const queryFnParams = queryKey[1];

      return getRoomDetailInfo(queryFnParams);
    },
  });

  const roomOptions = Object.entries(roomDetail || {}).reduce((acc, [key, val]) => {
    if (key.startsWith('opt')) {
      return {
        ...acc,
        [key]: val,
      };
    }

    return acc;
  }, {});

  return { roomDetail, roomOptions };
};

export default useRoomDetail;
