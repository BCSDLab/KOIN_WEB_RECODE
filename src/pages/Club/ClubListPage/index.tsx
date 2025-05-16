import { CLUB_CATEGORY } from 'static/club';
import styles from './ClubListPage.module.scss';

function ClubCard() {
  return (
    <div>
      <div>
        <div>BCSD</div>
        <div>학술분과</div>
        <div>동아리소개최대33글자</div>
      </div>
      <div>image</div>
    </div>
  );
}

function ClubListPage() {
  const totalCount = 1;

  return (
    <div className={styles.page}>
      <div className={styles.title}>동아리 목록</div>
      <div className={styles.categories}>
        <p className={styles.categories__Label}>Category</p>
        {CLUB_CATEGORY.map((category) => (
          <button
            type="button"
            className={styles.category__button}
          >
            {category}
          </button>
        ))}
      </div>
      <input
        className={styles['search-input']}
        placeholder="검색어를 입력하세요."
      />
      <div className={styles.description}>
        총
        {totalCount}
        개의 동아리가 있습니다.
      </div>
      <ClubCard />
    </div>
  );
}

export default ClubListPage;
