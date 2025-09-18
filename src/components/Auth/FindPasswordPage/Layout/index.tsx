import AuthLayout from 'components/Auth/AuthPage';
import Layout from 'components/layout';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';

function FindPWLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery();

  if (isMobile) {
    return (
      <AuthLayout>
        {children}
      </AuthLayout>
    );
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <Layout>{children}</Layout>;
}

export default FindPWLayout;
