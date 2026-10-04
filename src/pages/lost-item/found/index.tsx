import LostItemWritePage from 'components/Articles/LostItemWritePage';
import Layout from 'components/layout';
import type { MobileHeaderConfig } from 'components/layout/Header/mobileHeaderConfig';

const MOBILE_HEADER: MobileHeaderConfig = { type: 'page', title: '습득물 신고' };

export default function LostItemFound() {
  return <LostItemWritePage />;
}

LostItemFound.getLayout = (page: React.ReactElement) => <Layout mobileHeader={MOBILE_HEADER}>{page}</Layout>;
