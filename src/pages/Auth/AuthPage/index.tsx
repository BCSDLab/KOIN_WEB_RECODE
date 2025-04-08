/* eslint-disable jsx-a11y/control-has-associated-label */
import { Outlet } from 'react-router-dom';
import styles from './Auth.module.scss';

function AuthPage() {
  return (
    <div className={styles.template}>
      <div className={styles.template__content}>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthPage;
