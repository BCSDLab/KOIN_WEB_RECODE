import styles from './LoginPage.module.scss';
import LoginForm from './components/LoginForm';
import AdditionalLink from './components/AdditionalLink';
import Footer from './components/Footer';

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
