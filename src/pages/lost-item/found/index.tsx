import LostItemWritePage from 'components/Articles/LostItemWritePage';
import Layout from 'components/layout';

export default function LostItemFound() {
  return <LostItemWritePage />;
}

LostItemFound.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
