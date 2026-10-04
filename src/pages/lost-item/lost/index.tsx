import LostItemWritePage from 'components/Articles/LostItemWritePage';
import Layout from 'components/layout';
import type { MobileHeaderConfig } from 'components/layout/Header/mobileHeaderConfig';

const MOBILE_HEADER: MobileHeaderConfig = { type: 'page', title: '분실물 신고' };

export default function LostItemLost() {
  return <LostItemWritePage />;
}

LostItemLost.getLayout = (page: React.ReactElement) => <Layout mobileHeader={MOBILE_HEADER}>{page}</Layout>;
