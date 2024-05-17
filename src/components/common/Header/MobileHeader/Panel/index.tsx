import { cn } from '@bcsdlab/utils';
import { useNavigate } from 'react-router-dom';
import { CATEGORY } from 'static/category';
import useBooleanState from 'utils/hooks/useBooleanState';
import useLogger from 'utils/hooks/useLogger';
import { useLogout } from 'utils/hooks/useLogout';
import { useUser } from 'utils/hooks/useUser';
import { ReactComponent as BlackArrowBackIcon } from 'assets/svg/black-arrow-back-icon.svg';
import styles from './Panel.module.scss';

interface Props {
  isExpanded: boolean,
  hideSidebar: () => void,
}

export default function Panel({ isExpanded, hideSidebar }: Props) {
  const { data: userInfo } = useUser();
  const logout = useLogout();
  const logger = useLogger();
  const navigate = useNavigate();
  const [, openModal] = useBooleanState(false);

  const logShortcut = (title: string) => {
    if (title === '주변상점') logger.actionEventClick({ actionTitle: 'BUSINESS', title: 'hamburger_shop', value: '주변상점' });
    if (title === '시간표') logger.actionEventClick({ actionTitle: 'USER', title: 'hamburger_timetable', value: '햄버거 시간표' });
  };

  const handleMyInfoClick = () => {
    if (userInfo) {
      hideSidebar();
      openModal();
    } else {
      logger.actionEventClick({
        actionTitle: 'USER',
        title: 'hamburger_login',
        value: '햄버거 로그인',
      });
      navigate('/auth');
    }
  };

  const handleSubmenuClick = (title: string, link: string) => {
    logShortcut(title);
    hideSidebar();
    console.log('aaaa', link);
    navigate(link);
  };

  return (
    <nav
      className={cn({
        [styles.container]: true,
        [styles['container--expanded']]: isExpanded,
      })}
    >
      <div className={styles.top}>
        <button
          className={styles.top__close}
          type="button"
          aria-label="닫기 버튼"
          onClick={hideSidebar}
        >
          <BlackArrowBackIcon />
        </button>
      </div>
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
      <div className={styles.auth}>
        <button
          className={styles['auth__my-info']}
          type="button"
          onClick={() => handleMyInfoClick()}
        >
          내 정보
        </button>
        <button
          className={styles['auth__login-out']}
          type="button"
          onClick={userInfo ? logout : () => navigate('/auth')}
        >
          {userInfo ? '로그아웃' : '로그인'}
        </button>
      </div>
      <div className={styles.category}>
        {CATEGORY.map((category) => (
          <>
            <div key={category.title} className={styles.category__title}>
              {category.title}
            </div>
            <ul className={styles.category__submenus}>
              {category.submenu.map((submenu) => (
                <li key={submenu.title} className={styles.category__submenu}>
                  <button
                    type="button"
                    onClick={() => handleSubmenuClick(submenu.title, submenu.link)}
                  >
                    {submenu.title}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ))}
      </div>
    </nav>
  );
}
