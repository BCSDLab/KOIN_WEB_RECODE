import LoginForm from 'components/Auth/LoginForm/LoginForm';
import styles from './LoginPage.module.scss';

function LoginPage() {
  return (
    <div className={styles.template}>
      <LoginForm />
      <span className={styles.template__copyright}>
        COPYRIGHT ⓒ&nbsp;
        {
          new Date().getFullYear()
        }
        &nbsp;BY BCSDLab ALL RIGHTS RESERVED.
      </span>
    </div>
  );
}

export default LoginPage;
