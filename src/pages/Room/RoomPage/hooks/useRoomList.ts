import { useQuery } from 'react-query';
import * as api from 'api';

const useRoomList = () => {
  const { data: roomList } = useQuery(
    'roomList',
    api.room.getRoomList,
    {
      retry: 0,
    },
  );
  return roomList;
};

export default useRoomList;
