import ROUTES from 'static/routes';
import { withCacheControl } from 'utils/ssr/withCacheControl';

// eslint-disable-next-line @typescript-eslint/require-await -- withCacheControl 타입이 Promise 반환을 요구하지만 이 핸들러는 동기 리다이렉트 판단만 한다
export const getServerSideProps = withCacheControl(async ({ params }) => {
  const recruitmentId = params?.recruitmentId;
  const chatRoomId = params?.chatRoomId;

  return {
    redirect: {
      destination:
        typeof recruitmentId === 'string' && typeof chatRoomId === 'string'
          ? ROUTES.TeamChat({ recruitmentId, chatRoomId })
          : ROUTES.Team(),
      permanent: false,
    },
  };
});

export default function LegacyTeamChatPage() {
  return null;
}
