import { useRouter } from 'next/router';

import { useQuery } from '@tanstack/react-query';
import { clubQueries } from 'api/club/queries';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';

// 페이지가 getServerSideProps에서 dehydrate한 캐시라 서버 렌더에도 이름이 들어간다
export default function ClubDetailTitle() {
  const isLoggedIn = useIsLoggedIn();
  const clubId = Number(useRouter().query.id);
  const { data } = useQuery({ ...clubQueries.detail(clubId, isLoggedIn), enabled: !!clubId });

  return <>{data?.name}</>;
}
