import * as api from 'api';
import { useQuery } from '@tanstack/react-query';

const useRoomList = () => {
  const { data: roomList } = useQuery({
    queryKey: ['roomList'],
    queryFn: api.room.getRoomList,
  });

  return roomList;
};

export default useRoomList;
