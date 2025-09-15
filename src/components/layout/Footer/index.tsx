import Link from 'next/link';
import { useRouter } from 'next/router';
import LoginRequiredModal from 'components/modal/LoginRequiredModal';
import type { Portal } from 'components/modal/Modal/PortalProvider';
import { CATEGORY } from 'static/category';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useTokenState from 'utils/hooks/state/useTokenState';
import styles from './Footer.module.scss';

function Footer(): JSX.Element {
  const isMobile = useMediaQuery();
  const logger = useLogger();
  const isStage = process.env.NEXT_PUBLIC_API_PATH?.includes('stage');
  const portalManager = useModalPortal();
  const token = useTokenState();

  const router = useRouter();
  const { pathname } = router; // 현재 URL의 경로

  const logShortcut = (title: string) => {
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
      동아리: { team: 'CAMPUS', event_label: 'footer', value: '동아리' },
    };

    if (loggingMap[title]) {
      logger.actionEventClick(loggingMap[title]);

      if (String(pathname) === ROUTES.GraduationCalculator()) {
        logger.actionEventClick({
          team: 'USER',
          event_label: 'graduation_calculator_back',
          value: `탈출_푸터_${title}`,
        });
      }
    }
  };

  const handleClickMenu = (e: React.MouseEvent<HTMLAnchorElement>, title: string) => {
    logShortcut(title);
    if (!token && title === '쪽지') {
      e.preventDefault();
      portalManager.open((portalOption: Portal) => (
        <LoginRequiredModal
          title="쪽지를 사용하기"
          description="로그인 후 이용해주세요."
          onClose={portalOption.close}
        />
      ));
    }
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
                    href={isStage && submenuInfo.stageLink
                      ? submenuInfo.stageLink : submenuInfo.link}
                    onClick={(e) => handleClickMenu(e, submenuInfo.title)}
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
            href={ROUTES.Main()}
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
              <Link
                href={ROUTES.PrivatePolicy()}
                className={styles.sitemap__link}
              >
                개인정보 처리방침
              </Link>
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
              <Link
                href={ROUTES.PrivatePolicy()}
                className={styles.sitemap__link}
              >
                개인정보 처리방침
              </Link>
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
            <Link className={styles['sitemap__icon-link']} href={ROUTES.Main()}>
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
