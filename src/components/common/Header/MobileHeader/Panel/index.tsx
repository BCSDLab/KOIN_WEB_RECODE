import useTokenState from 'utils/hooks/useTokenState';
import { useUser } from 'utils/hooks/useUser';
import styles from './Panel.module.scss';

interface Props {
  isExpanded: boolean,
  hideSidebar: () => void,
}

export default function Panel({ isExpanded, hideSidebar }: Props) {
  // const token = useTokenState();
  // const isAuth = !!token;
  const { data: userInfo } = useUser();
  // const logout = useLogout();
  // const logger = useLogger();
  // const [, openModal] = useBooleanState(false);

  // const loggingBusinessShortCut = (title: string) => {
  //   if (title === '주변상점') logger.actionEventClick({ actionTitle: 'BUSINESS', title: 'hamburger_shop', value: title });
  //   if (title === '시간표') logger.actionEventClick({ actionTitle: 'USER', title: 'hamburger_timetable', value: `햄버거 ${title}` });
  // };

  // const openMobileAuthenticateUserModal = () => {
  //   hideSidebar();
  //   openModal();
  // };

  return (
    <nav className={styles.container}>
      <div className={styles.top}>
        <div className={styles.greet}>
          {userInfo ? (
            <>
              <span>{userInfo.nickname}</span>
              님, 안녕하세요!
            </>
          ) : (
            <>로그인 후 더 많은 기능을 사용하세요.</>
          )}
        </div>
      </div>
      <div className={styles.auth}>
        <div className={styles['my-info']}>
          a
        </div>
        <div className={styles['login-out']}>
          a
        </div>
      </div>
      <div className={styles.services}>
        <div className={styles.link}>
          a
        </div>
      </div>
    </nav>
  );
}
