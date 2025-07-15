import { Link } from 'react-router-dom';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import LockIcon from 'assets/svg/lock-icon.svg';
import FaceIcon from 'assets/svg/face-icon.svg';
import MagnifyingGlassIcon from 'assets/svg/Login/magnifying-glass.svg';
import styles from './AdditionalLink.module.scss';

export default function AdditionalLink() {
  const logger = useLogger();
  const isMobile = useMediaQuery();

  const onClickFindId = () => {
    logger.actionEventClick({
      team: 'USER',
      event_label: 'login',
      value: '아이디찾기',
    });
  };

  const onClickFindPassword = () => {
    logger.actionEventClick({
      team: 'USER',
      event_label: 'login',
      value: '비밀번호 찾기',
    });
  };

  if (isMobile) {
    return (
      <div className={styles.help}>
        <Link
          className={styles.help__link}
          to={ROUTES.AuthFindID()}
          onClick={onClickFindId}
        >
          <MagnifyingGlassIcon />
          아이디 찾기
        </Link>
        <Link
          className={styles.help__link}
          to={ROUTES.AuthFindPW({ step: '계정인증', isLink: true })}
          onClick={onClickFindPassword}
        >
          <LockIcon />
          비밀번호 찾기
        </Link>
        <Link
          className={styles.help__link}
          to={ROUTES.Main()}
          onClick={() => {
            logger.actionEventClick({
              team: 'USER',
              event_label: 'login',
              value: '메인 페이지',
            });
          }}
        >
          <FaceIcon />
          둘러보기
        </Link>
      </div>

    );
  }

  return (
    <div className={styles.help}>
      <Link
        className={styles.help__link}
        to={ROUTES.AuthFindID()}
        onClick={onClickFindId}
      >
        아이디 찾기
      </Link>
      <Link
        className={styles.help__link}
        to={ROUTES.AuthFindPW({ step: '계정인증', isLink: true })}
        onClick={onClickFindPassword}
      >
        비밀번호 찾기
      </Link>
      <Link
        className={styles.help__link}
        to={ROUTES.AuthSignup({ currentStep: '약관동의', isLink: true })}
        onClick={() => {
          logger.actionEventClick({
            team: 'USER',
            event_label: 'start_sign_up',
            value: '회원가입 시작',
            custom_session_id: '도훈',
          });
        }}
      >
        회원가입
      </Link>
    </div>
  );
}
