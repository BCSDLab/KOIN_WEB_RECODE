import { queryOptions, useQuery } from '@tanstack/react-query';
import * as api from 'api';

const useRoomList = () => {
  const { data: roomList } = useQuery(
    queryOptions({ // query option 사용해봄 나중에 하나로 묶을 수도.
      queryKey: ['roomList'],
      queryFn: api.room.getRoomList,
    }),
  );

  return roomList;
};

export default useRoomList;
