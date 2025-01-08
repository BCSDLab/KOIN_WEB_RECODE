import * as api from 'api';
import { useQuery } from '@tanstack/react-query';

const useRoomDetail = (id: string) => {
  const { data: roomDetail } = useQuery({
    queryKey: ['roomDetail', id],
    queryFn: async ({ queryKey }) => {
      const queryFnParams = queryKey[1];

      return api.room.getRoomDetailInfo(queryFnParams);
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
