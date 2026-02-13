import { useQuery } from '@tanstack/react-query';
import { getRoomList } from 'api/room';

const useRoomList = () => {
  const { data: roomList } = useQuery({
    queryKey: ['roomList'],
    queryFn: getRoomList,
  });

  return roomList;
};

export default useRoomList;
