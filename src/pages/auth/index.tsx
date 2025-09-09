import LoginForm from 'components/Auth/LoginPage/components/LoginForm';
import AdditionalLink from 'components/Auth/LoginPage/components/AdditionalLink';
import Footer from 'components/Auth/LoginPage/components/Footer';
import AuthLayout from 'components/Auth/AuthPage';
import styles from './LoginPage.module.scss';

function LoginPage() {
  return (
    <div className={styles.template}>
      <LoginForm />
      <AdditionalLink />
      <Footer />
    </div>
  );
}

LoginPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <AuthLayout>
      {page}
    </AuthLayout>
  );
};

export default LoginPage;
