/* eslint-disable @next/next/no-img-element */
/* 푸터 로고는 작은 정적 이미지라 Next/Image 최적화 이득이 작아 img 유지 */
import Link from 'next/link';
import { useRouter } from 'next/router';
import LoginRequiredModal from 'components/modal/LoginRequiredModal';
import ROUTES from 'static/routes';
import { ORDER_BASE_URL } from 'static/url';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useTokenState from 'utils/hooks/state/useTokenState';
import type { Portal } from 'components/modal/Modal/PortalProvider';
import styles from './Footer.module.scss';

interface FooterMenu {
  label: string;
  link: string;
  team: string;
  stageLink?: string;
  /** 푸터 표기명이 바뀐 항목은 기존 GA 지표와 이어지도록 예전 value를 유지한다. */
  logValue?: string;
  /** 비로그인 상태에서 이동을 막고 로그인 안내 모달을 띄운다. */
  requiresLogin?: boolean;
}

/** 푸터에 노출할 서비스. 노출 여부와 순서를 여기서만 관리한다. */
const FOOTER_MENUS: FooterMenu[] = [
  { label: '공지사항', link: ROUTES.Articles(), team: 'CAMPUS' },
  { label: '버스/교통', link: ROUTES.BusRoute(), team: 'CAMPUS', logValue: '버스 교통편' },
  { label: '식단', link: ROUTES.Cafeteria(), team: 'CAMPUS' },
  { label: '시간표', link: ROUTES.Timetable(), team: 'USER' },
  { label: '복덕방', link: ROUTES.Room(), team: 'BUSINESS' },
  { label: '주변상점', link: `${ORDER_BASE_URL}/shops/?category=1`, team: 'BUSINESS' },
  { label: '교내 시설물 정보', link: ROUTES.CampusInfo(), team: 'CAMPUS' },
  { label: '팀원모집', link: ROUTES.Team(), team: 'CAMPUS' },
  {
    label: '코인 for Business',
    link: 'https://owner.koreatech.in/',
    stageLink: 'https://owner.stage.koreatech.in',
    team: 'BUSINESS',
    logValue: '코인 사장님',
  },
  { label: '쪽지', link: ROUTES.LostItemChat(), team: 'CAMPUS', requiresLogin: true },
];

const EXTERNAL_LINKS = [
  { label: 'BCSD Lab 바로가기', href: 'https://bcsdlab.com' },
  { label: '코리아텍 바로가기', href: 'https://koreatech.ac.kr' },
  { label: '아우누리 바로가기', href: 'https://portal.koreatech.ac.kr' },
];

function Footer() {
  const isMobile = useMediaQuery();
  const logger = useLogger();
  const router = useRouter();
  const token = useTokenState();
  const portalManager = useModalPortal();
  const isStage = process.env.NEXT_PUBLIC_API_PATH?.includes('stage');

  if (isMobile) {
    return null;
  }

  const logShortcut = (menu: FooterMenu) => {
    const value = menu.logValue ?? menu.label;

    logger.actionEventClick({ team: menu.team, event_label: 'footer', value });

    if (router.pathname === ROUTES.GraduationCalculator()) {
      logger.actionEventClick({
        team: 'USER',
        event_label: 'graduation_calculator_back',
        value: `탈출_푸터_${value}`,
      });
    }
  };

  const handleClickMenu = (e: React.MouseEvent<HTMLAnchorElement>, menu: FooterMenu) => {
    logShortcut(menu);

    if (menu.requiresLogin && !token) {
      e.preventDefault();
      portalManager.open((portalOption: Portal) => (
        <LoginRequiredModal
          title={`${menu.label}를 사용하기`}
          description="로그인 후 이용해주세요."
          onClose={portalOption.close}
        />
      ));
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__content}>
        <ul className={styles.footer__services}>
          {FOOTER_MENUS.map((menu) => (
            <li className={styles.footer__service} key={menu.label}>
              <Link
                href={isStage && menu.stageLink ? menu.stageLink : menu.link}
                prefetch={false}
                onClick={(e) => handleClickMenu(e, menu)}
              >
                {menu.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.sitemap}>
          <Link className={styles.sitemap__logo} href={ROUTES.Main()}>
            <img
              src="https://static.koreatech.in/assets/img/logo_white.png"
              alt="KOIN service logo"
              width={72}
              height={41}
              loading="lazy"
              decoding="async"
            />
          </Link>

          <ul className={styles.sitemap__content}>
            {EXTERNAL_LINKS.map((externalLink) => (
              <li className={styles.sitemap__link} key={externalLink.label}>
                <a href={externalLink.href} target="_blank" rel="noreferrer">
                  {externalLink.label}
                </a>
              </li>
            ))}

            <li className={styles.sitemap__link}>
              <Link href={ROUTES.PrivatePolicy()} prefetch={false}>
                개인정보 처리방침
              </Link>
            </li>
          </ul>

          <span className={styles.sitemap__copyright}>
            COPYRIGHT ⓒ&nbsp;
            {new Date().getFullYear()}
            &nbsp;BY BCSDLab ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
