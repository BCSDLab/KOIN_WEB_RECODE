import { useQuery } from '@tanstack/react-query';
import { roomQueries } from 'api/room/queries';

const useRoomDetail = (id: string) => {
  const { data: roomDetail } = useQuery(roomQueries.detail(id));

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
