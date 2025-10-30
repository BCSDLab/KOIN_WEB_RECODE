import Error from 'assets/svg/page-not-found-error.svg';
import { useRouter } from 'next/router';
import styles from './PageNotFound.module.scss';

export default function PageNotFound() {
  const router = useRouter();

  return (
    <div className={styles.template}>
      <div className={styles['error-icon']}>
        <Error />
      </div>
      <div className={styles.content}>
        <div className={styles.content__title}>개발 중인 페이지입니다</div>
        <div className={styles.content__description}>
          죄송합니다. 현재 개발 중인 페이지입니다.
          <br />
          최대한 빠르게 오픈하도록 하겠습니다.
        </div>
        <button type="button" className={styles.content__button} onClick={() => router.push('/')}>
          메인 화면 바로가기
        </button>
      </div>
    </div>
  );
}
