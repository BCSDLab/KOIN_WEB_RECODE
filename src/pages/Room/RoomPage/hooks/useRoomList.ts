import { useQuery } from '@tanstack/react-query';
import * as api from 'api';

const useRoomList = () => {
  const { data: roomList } = useQuery({
    queryKey: ['roomList'],
    queryFn: api.room.getRoomList,
  });

  return roomList;
};

export default useRoomList;
