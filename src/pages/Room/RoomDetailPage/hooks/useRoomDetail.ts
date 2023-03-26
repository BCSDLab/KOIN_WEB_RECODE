import { useQuery } from 'react-query';
import * as api from 'api';

const useRoomDetail = (id: string | undefined) => {
  const { data: roomDetail } = useQuery(
    ['roomDetail', id],
    ({ queryKey }) => api.room.getRoomDetailInfo(queryKey[1]),
    {
      retry: 0,
    },
  );
  return roomDetail;
};

export default useRoomDetail;
