import { Review } from 'api/store/entity';
import { ReactComponent as EmptyStar } from 'assets/svg/Review/empty-star.svg';
import { ReactComponent as Star } from 'assets/svg/Review/star.svg';
import { ReactComponent as Kebab } from 'assets/svg/Review/kebab.svg';
import { ReactComponent as Mine } from 'assets/svg/Review/check-mine.svg';
import { useEffect, useState } from 'react';
import SelectButton from 'pages/Store/StoreDetailPage/Review/components/SelectButton/SelectButton';
import styles from './ReviewCard.module.scss';

export default function ReviewCard({
  nick_name, rating, content, image_urls, menu_names, is_mine, is_modified, created_at,
}: Review) {
  const [isKebabClick, setIsKebabClick] = useState(false);
  const emptyStarList = new Array(5 - rating).fill(false);
  const starList = new Array(rating).fill(true);

  useEffect(() => {
    window.addEventListener('click', () => setIsKebabClick(false));

    return window.removeEventListener('click', () => setIsKebabClick(false));
  }, []);

  const ratingList = [...starList, ...emptyStarList];
  return (
    <div className={is_mine ? styles['container--mine'] : styles.container}>
      {is_mine && (
      <div className={styles.mine}>
        <Mine />
        내가 작성한 리뷰
      </div>
      )}
      <div className={styles.top}>
        <div className={styles['nick-name']}>{nick_name}</div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsKebabClick(true);
          }}
          className={styles.top__kebab}
        >
          <Kebab />
          {isKebabClick && <SelectButton is_mine={is_mine} />}
        </button>
      </div>
      <div className={styles.rating}>
        <div>
          {ratingList.map((ratio) => (ratio ? <Star /> : <EmptyStar />))}
        </div>
        <div className={styles.created}>
          {created_at}
          {is_modified && '(수정됨)'}
        </div>
      </div>
      <div className={styles.content}>
        {content}
      </div>
      <div className={styles['image-wrapper']}>
        {image_urls.map((src) => <img key={src} src={src} alt="메뉴 이미지" className={styles.menu__image} />)}
      </div>
      <div className={styles['menu-card']}>
        {menu_names.map((menu) => <div className={styles['menu-card__menu']} key={menu}>{menu}</div>)}
      </div>
    </div>
  );
}
