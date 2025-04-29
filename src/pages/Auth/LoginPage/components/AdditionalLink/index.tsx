import { Link } from 'react-router-dom';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import LockIcon from 'assets/svg/lock-icon.svg';
import FaceIcon from 'assets/svg/face-icon.svg';
import styles from './AdditionalLink.module.scss';

export default function AdditionalLink() {
  const logger = useLogger();
  const isMobile = useMediaQuery();

  if (isMobile) {
    return (
      <div className={styles.help}>
        <Link
          className={styles.help__link}
          to={ROUTES.AuthFindPW()}
          onClick={() => {
            logger.actionEventClick({
              team: 'USER',
              event_label: 'login',
              value: '비밀번호찾기',
            });
          }}
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
      <a
        className={styles.help__link}
        href="https://portal.koreatech.ac.kr/kut/page/findUser.jsp"
        target="_blank"
        onClick={() => {
          logger.actionEventClick({
            team: 'USER',
            event_label: 'login',
            value: '아이디찾기',
          });
        }}
        rel="noopener noreferrer"
      >
        아이디 찾기
      </a>
      <Link
        className={styles.help__link}
        to={ROUTES.AuthFindPW()}
        onClick={() => {
          logger.actionEventClick({
            team: 'USER',
            event_label: 'login',
            value: '비밀번호찾기',
          });
        }}
      >
        비밀번호 찾기
      </Link>
      <Link
        className={styles.help__link}
        to={ROUTES.AuthSignup()}
        onClick={() => {
          logger.actionEventClick({
            team: 'USER',
            event_label: 'login',
            value: '회원가입',
          });
        }}
      >
        회원가입
      </Link>
    </div>
  );
}
