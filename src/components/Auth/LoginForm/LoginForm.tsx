/* eslint-disable jsx-a11y/label-has-associated-control */
import { Link } from 'react-router-dom';
import styles from './LoginForm.module.scss';
import Input from '../Input';

function LoginForm() {
  return (
    <>
      <form className={styles.loginform}>
        <Input />
        <Input />
        <button type="submit" className={styles.loginform__button}>
          로그인
        </button>
      </form>
      <div className={styles.autologin}>
        <input className={styles.autologin__checkbox} type="checkbox" id="autoLoginCheckBox" />
        <label className={styles.autologin__text} htmlFor="autoLoginCheckBox">자동 로그인</label>
      </div>
      <div className={styles.help}>
        <a className={styles.help__finduser} href="https://portal.koreatech.ac.kr/kut/page/findUser.jsp">아이디 찾기</a>
        <Link className={styles.help__findpassword} to="/findpw">비밀번호 찾기</Link>
        <Link className={styles.help__signup} to="/signup">회원가입</Link>
      </div>
    </>
  );
}

export default LoginForm;
