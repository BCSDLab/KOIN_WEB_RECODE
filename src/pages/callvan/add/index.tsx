import { useRouter } from 'next/router';
import AddPostForm from 'components/Callvan/components/AddPostForm';
import CallvanActionModal from 'components/Callvan/components/CallvanActionModal';
import useMount from 'utils/hooks/state/useMount';
import useTokenState from 'utils/hooks/state/useTokenState';
import { redirectToLogin } from 'utils/ts/auth';

export default function CallvanAddPage() {
  const token = useTokenState();
  const mounted = useMount();
  const router = useRouter();

  const handleLoginConfirm = () => {
    redirectToLogin(router.asPath);
  };

  const handleCancel = () => {
    router.back();
  };

  if (!mounted) return null;

  return (
    <>
      <AddPostForm />
      {!token && (
        <CallvanActionModal
          title="콜밴팟에 참여하려면 로그인이 필요해요."
          confirmLabel="로그인하기"
          cancelLabel="닫기"
          onConfirm={handleLoginConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}

CallvanAddPage.getLayout = (page: React.ReactNode) => <>{page}</>;
