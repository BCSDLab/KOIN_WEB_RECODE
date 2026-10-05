import LostItemWritePage from 'components/Articles/LostItemWritePage';
import Layout from 'components/layout';

export default function LostItemLost() {
  return <LostItemWritePage />;
}

LostItemLost.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
