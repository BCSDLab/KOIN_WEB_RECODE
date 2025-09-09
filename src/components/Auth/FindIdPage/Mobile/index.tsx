import AuthLayout from 'components/Auth/AuthPage';
import Layout from 'components/layout';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import MobileLayout from './Layout';

function FindIdLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery();

  if (isMobile) {
    return (
      <AuthLayout>
        <MobileLayout>{children}</MobileLayout>
      </AuthLayout>
    );
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <Layout>{children}</Layout>;
}

export default FindIdLayout;
