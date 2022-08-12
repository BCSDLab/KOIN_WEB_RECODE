import LoginForm from 'components/Auth/LoginForm/LoginForm';
import styles from './LoginPage.module.scss';

function LoginPage() {
  return (
    <div className={styles.template}>
      <div className={styles.template__content}>
        <LoginForm />
        <span className={styles.template__copyright}>
          COPYRIGHT ⓒ&nbsp;
          {
            new Date().getFullYear()
          }
          &nbsp;BY BCSDLab ALL RIGHTS RESERVED.
        </span>
      </div>
    </div>
  );
}

export default LoginPage;
