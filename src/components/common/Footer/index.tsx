import { Link } from 'react-router-dom';
import { CATEGORY } from 'static/category';
import useLogger from 'utils/hooks/useLogger';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import styles from './Footer.module.scss';

function Footer(): JSX.Element {
  const isMobile = useMediaQuery();
  const logger = useLogger();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__content}>
        {!isMobile && (
          <ul className={styles.footer__services}>
            {CATEGORY
              .flatMap((categoryInfo) => categoryInfo.submenu)
              .map((submenuInfo) => (
                <li className={styles.footer__service} key={submenuInfo.title}>
                  <Link to={submenuInfo.link} onClick={() => logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'footer', value: submenuInfo.title })}>
                    {submenuInfo.title}
                  </Link>
                </li>
              ))}
          </ul>
        )}
        <div className={styles.sitemap}>
          <Link
            className={styles.sitemap__logo}
            to="/"
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
              <li className={styles.sitemap__link}>
                <Link to="/privacy-policy">개인정보 처리방침</Link>
              </li>
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
              <li className={styles.sitemap__link}>
                <Link to="/privacy-policy">개인정보 처리방침</Link>
              </li>
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
            <Link className={styles['sitemap__icon-link']} to="/">
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
