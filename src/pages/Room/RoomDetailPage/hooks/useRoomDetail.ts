import { queryOptions, useQuery } from '@tanstack/react-query';
import * as api from 'api';

const useRoomDetail = (id: string) => {
  const { data: roomDetail } = useQuery(
    queryOptions({
      queryKey: ['roomDetail', id],
      queryFn: async ({ queryKey }) => {
        const a = queryKey[1]; // 왜 객체로 받고 있지????????

        return api.room.getRoomDetailInfo(a);
      },

    }),
  );

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
