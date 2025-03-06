import { Link, useNavigate } from 'react-router-dom';
import { CATEGORY } from 'static/category';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './Footer.module.scss';

function Footer(): JSX.Element {
  const isMobile = useMediaQuery();
  const logger = useLogger();
  const navigate = useNavigate();
  // const pathname = useParams();
  const isStage = import.meta.env.VITE_API_PATH?.includes('stage');

  const logShortcut = (title: string) => {
    if (title === '식단') logger.actionEventClick({ actionTitle: 'CAMPUS', event_label: 'footer', value: '식단' });
    if (title === '버스/교통') logger.actionEventClick({ actionTitle: 'CAMPUS', event_label: 'footer', value: '버스/교통' });
    if (title === '공지사항') logger.actionEventClick({ actionTitle: 'CAMPUS', event_label: 'footer', value: '공지사항' });
    if (title === '주변상점') logger.actionEventClick({ actionTitle: 'BUSINESS', event_label: 'footer', value: '주변상점' });
    if (title === '복덕방') logger.actionEventClick({ actionTitle: 'BUSINESS', event_label: 'footer', value: '복덕방' });
    if (title === '시간표') logger.actionEventClick({ actionTitle: 'USER', event_label: 'footer', value: '시간표' });
    if (title === '교내 시설물 정보') logger.actionEventClick({ actionTitle: 'CAMPUS', event_label: 'footer', value: '교내 시설물 정보' });
    if (title === '쪽지') logger.actionEventClick({ actionTitle: 'CAMPUS', event_label: 'footer', value: '쪽지' });
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
          <div className={styles['sitemap__icon-links']}>
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
