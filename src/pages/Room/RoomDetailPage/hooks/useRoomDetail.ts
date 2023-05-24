import { useQuery } from 'react-query';
import * as api from 'api';

const useRoomDetail = (id: string) => {
  const { data: roomDetail } = useQuery(
    ['roomDetail', id],
    ({ queryKey }) => api.room.getRoomDetailInfo(queryKey[1]),
    {
      retry: 0,
    },
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
