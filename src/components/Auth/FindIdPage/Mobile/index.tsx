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
  return <Layout>{children}</Layout>;
}

export default FindIdLayout;
