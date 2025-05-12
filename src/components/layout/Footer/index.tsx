/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CATEGORY } from 'static/category';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './Footer.module.scss';

function Footer(): JSX.Element {
  const isMobile = useMediaQuery();
  const logger = useLogger();
  const navigate = useNavigate();
  const isStage = import.meta.env.VITE_API_PATH?.includes('stage');

  const location = useLocation();
  const { pathname } = location; // 현재 URL의 경로

  const logShortcut = async (title: string) => {
    const loggingMap: Record<
    string,
    { team: string; event_label: string; value: string; event_category?: string }> = {
      공지사항: { team: 'CAMPUS', event_label: 'footer', value: '공지사항' },
      '버스 교통편': { team: 'CAMPUS', event_label: 'footer', value: '버스 교통편' },
      '버스 시간표': { team: 'CAMPUS', event_label: 'footer', value: '버스 시간표' },
      식단: { team: 'CAMPUS', event_label: 'footer', value: '식단' },
      시간표: { team: 'USER', event_label: 'footer', value: '시간표' },
      복덕방: { team: 'BUSINESS', event_label: 'footer', value: '복덕방' },
      주변상점: { team: 'BUSINESS', event_label: 'footer', value: '주변상점' },
      '교내 시설물 정보': { team: 'CAMPUS', event_label: 'footer', value: '교내 시설물 정보' },
      '코인 사장님': { team: 'BUSINESS', event_label: 'footer', value: '코인 사장님' },
      쪽지: { team: 'CAMPUS', event_label: 'footer', value: '쪽지' },
    };

    if (loggingMap[title]) {
      logger.actionEventClick(loggingMap[title]);

      if (String(pathname) === ROUTES.GraduationCalculator()) {
        logger.actionEventClick({
          team: 'USER',
          event_label: 'graduation_calculator_back',
          value: `탈출_푸터_${title}`,
          event_category: 'click',
        });
      }
    }
  };

  const test = () => {
    throw new Error('🐞 Bugsink sourcemap test error');
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__content}>
        {!isMobile && (
          <ul className={styles.footer__services}>
            {CATEGORY
              .flatMap((categoryInfo) => categoryInfo.submenu)
              .slice(0, -4).map((submenuInfo) => (
                <li className={styles.footer__service} key={submenuInfo.title}>
                  <Link
                    to={isStage && submenuInfo.stageLink ? submenuInfo.stageLink : submenuInfo.link}
                    onClick={() => logShortcut(submenuInfo.title)}
                  >
                    {submenuInfo.title}
                  </Link>
                </li>
              ))}
          </ul>
        )}
        <div className={styles.sitemap}>
          <Link
            className={styles.sitemap__logo}
            to={ROUTES.Main()}
          >
            <img
              src="https://static.koreatech.in/assets/img/logo_white.png"
              alt="KOIN service logo"
            />
          </Link>
          {!isMobile ? (
            <ul className={styles.sitemap__content}>
              <li className={styles.sitemap__link}>
                <a href="https://forms.gle/qYw17r2kihThiJvj7" target="_blank" rel="noreferrer">문의하기</a>
              </li>
              <li className={styles.sitemap__link}>
                <a href="https://bcsdlab.com" target="_blank" rel="noreferrer">BCSD Lab 바로가기</a>
              </li>
              <li className={styles.sitemap__link}>
                <a href="https://koreatech.ac.kr" target="_blank" rel="noreferrer">코리아텍 바로가기</a>
              </li>
              <li className={styles.sitemap__link}>
                <a href="https://portal.koreatech.ac.kr" target="_blank" rel="noreferrer">아우누리 바로가기</a>
              </li>
              <button
                type="button"
                className={styles.sitemap__link}
                onClick={() => { navigate(ROUTES.PrivatePolicy()); }}
              >
                개인정보 처리방침
              </button>
            </ul>
          ) : (
            <ul className={styles.sitemap__content}>
              <li className={styles.sitemap__link}>
                <a href="https://forms.gle/qYw17r2kihThiJvj7" target="_blank" rel="noreferrer">문의하기</a>
              </li>
              <li className={styles.sitemap__link}>
                <a href="https://koreatech.ac.kr" target="_blank" rel="noreferrer">코리아텍 바로가기</a>
              </li>
              <li className={styles.sitemap__link}>
                <a href="https://portal.koreatech.ac.kr" target="_blank" rel="noreferrer">아우누리 바로가기</a>
              </li>
              <li className={styles.sitemap__link}>
                <a href="https://bcsdlab.com" target="_blank" rel="noreferrer">BCSD Lab 바로가기</a>
              </li>
              <button
                type="button"
                className={styles.sitemap__link}
                onClick={() => { navigate(ROUTES.PrivatePolicy()); }}
              >
                개인정보 처리방침
              </button>
            </ul>
          )}
          <div className={styles['sitemap__icon-links']} onClick={test}>
            <a
              className={styles['sitemap__icon-link']}
              href="https://www.facebook.com/bcsdlab"
              target="_blank"
              rel="noreferrer"
            >
              <img src="https://static.koreatech.in/upload/fead6221d535ff547d4801081ee8f2e3.png" alt="facebook" />
            </a>
            <Link className={styles['sitemap__icon-link']} to={ROUTES.Main()}>
              <img src="https://static.koreatech.in/upload/1aae9a021f0338527c28e5c3d0518fa1.png" alt="home" />
            </Link>
          </div>
          <span className={styles.sitemap__copyright}>
            COPYRIGHT ⓒ&nbsp;
            {
              new Date().getFullYear()
            }
            &nbsp;BY BCSDLab ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
