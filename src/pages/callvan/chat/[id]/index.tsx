import { Suspense } from 'react';
import { useRouter } from 'next/router';

import CallvanChatRoom from 'components/Callvan/components/CallvanChatRoom';

export default function CallvanChatPage() {
  const router = useRouter();
  const postId = Number(router.query.id);

  if (!postId) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <CallvanChatRoom postId={postId} />
    </Suspense>
  );
}

CallvanChatPage.getLayout = (page: React.ReactNode) => <>{page}</>;
