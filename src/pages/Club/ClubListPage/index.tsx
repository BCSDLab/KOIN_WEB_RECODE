import { cn } from '@bcsdlab/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useClubCategories from 'pages/Club/hooks/useClubCategories';
import useClubList from 'pages/Club/hooks/useClubList';
import { Selector } from 'components/ui/Selector';
import styles from './ClubListPage.module.scss';

const DEFAULT_OPTION_INDEX = 0;

const SORT_OPTIONS = [
  { label: '생성순', value: 'created' },
  { label: '조회순', value: 'views' },
];

function ClubListPage() {
  const navigate = useNavigate();
  const [sortValue, setSortValue] = useState(SORT_OPTIONS[DEFAULT_OPTION_INDEX].value);
  const clubCategories = useClubCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
  const clubList = useClubList({ categoryId: selectedCategoryId, hitSort: sortValue !== 'created' });
  const totalCount = clubList.length;

  const onChangeSort = (e: { target: { value: string } }) => {
    const { target } = e;
    setSortValue(target?.value);
  };

  const handleCategoryClick = (id: number) => {
    setSelectedCategoryId((prevId) => (prevId === id ? undefined : id));
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.header__title}>동아리 목록</p>
          <button
            type="button"
            className={styles['header__add-button']}
            onClick={() => navigate('/club/new')}
          >
            동아리 생성하기
          </button>
        </div>
        <main>
          <div className={styles.categories}>
            <p className={styles.categories__label}>Category</p>
            {clubCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryClick(category.id)}
                className={cn({
                  [styles.categories__button]: true,
                  [styles['categories__button--selected']]: category.id === selectedCategoryId,
                })}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className={styles.description}>
            <div className={styles.description__message}>
              총
              <strong>
                {' '}
                {totalCount}
                개
              </strong>
              의 동아리가 있습니다.
            </div>
            <div className={styles.description__dropdown}>
              <Selector
                isWhiteBackground={false}
                options={SORT_OPTIONS}
                value={sortValue}
                onChange={onChangeSort}
              />
            </div>
          </div>
          <div className={styles.card__list}>
            {clubList.map((club) => (
              <button
                type="button"
                key={club.id}
                className={styles.card}
                onClick={() => navigate(`/club/${club.id}`)}
              >
                <div className={styles.card__info}>
                  <div className={styles['card__info-title']}>{club.name}</div>
                  <div className={styles['card__info-category']}>{club.category}</div>
                </div>
                <img
                  className={styles.card__logo}
                  src={club.imageUrl}
                  alt={club.name}
                />
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ClubListPage;
