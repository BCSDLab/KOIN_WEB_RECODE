import { useRouter } from 'next/router';

import TeamNotificationMenu from 'components/Team/components/TeamNotificationMenu';
import PageHeader from 'components/ui/PageHeader';
import ROUTES from 'static/routes';

// 데스크톱 전용. 모바일은 레이아웃 헤더가 같은 메뉴를 그린다
export default function TeamNotificationHeader() {
  const router = useRouter();

  return (
    <PageHeader title="알림" onBack={() => router.replace(ROUTES.Team())} rightAction={<TeamNotificationMenu />} />
  );
}
