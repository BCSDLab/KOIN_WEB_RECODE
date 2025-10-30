import AdditionalLink from './components/AdditionalLink';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
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

export default LoginPage;
