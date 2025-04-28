import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './Footer.module.scss';

export default function Footer() {
  const isMobile = useMediaQuery();

  return (
    <>
      {isMobile && (
      <a
        className={styles.owner}
        href="https://owner.koreatech.in/"
      >
        사장님이신가요?
      </a>
      )}
      <span className={styles.copyright}>
        COPYRIGHT ⓒ&nbsp;
        {new Date().getFullYear()}
        &nbsp;BY BCSDLab ALL RIGHTS RESERVED.
      </span>
    </>
  );
}
