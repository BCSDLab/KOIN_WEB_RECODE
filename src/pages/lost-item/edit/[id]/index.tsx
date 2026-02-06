import React from 'react';
import { useRouter } from 'next/router';
import LostItemEditPage from 'components/Articles/LostItemEditPage';
import Layout from 'components/layout';

export default function LostItemEdit() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== 'string') {
    return null;
  }

  return <LostItemEditPage articleId={Number(id)} />;
}

LostItemEdit.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
