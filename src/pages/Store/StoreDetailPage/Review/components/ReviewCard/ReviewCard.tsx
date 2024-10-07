import { Review } from 'api/store/entity';
import EmptyStar from 'assets/svg/Review/empty-star.svg';
import Star from 'assets/svg/Review/star.svg';
import Kebab from 'assets/svg/Review/kebab.svg';
import ClickedKebab from 'assets/svg/Review/clicked-kebab.svg';
import Mine from 'assets/svg/Review/check-mine.svg';
import InformationIcon from 'assets/svg/information-icon.svg';
import SelectButton from 'pages/Store/StoreDetailPage/Review/components/SelectButton/SelectButton';
import ImageModal from 'components/common/Modal/ImageModal';
import { cn } from '@bcsdlab/utils';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import { Portal } from 'components/common/Modal/PortalProvider';
import { useDropdown } from 'pages/Store/StoreDetailPage/hooks/useDropdown';
import { useCallback, useEffect } from 'react';
import styles from './ReviewCard.module.scss';

export default function ReviewCard({
  nick_name, rating, content, image_urls, menu_names,
  is_mine, is_modified, created_at, review_id, is_reported,
}: Review) {
  const emptyStarList = new Array(5 - rating).fill(false);
  const starList = new Array(rating).fill(true);
  const portalManager = useModalPortal();
  const { openDropdown, toggleDropdown, closeDropdown } = useDropdown();
  const isOpen = openDropdown === String(review_id);

  const onClickImage = (img: string[], index: number) => {
    portalManager.open((portalOption: Portal) => (
      <ImageModal imageList={img} imageIndex={index} onClose={portalOption.close} />
    ));
  };

  const handleDropdown = useCallback(() => {
    if (openDropdown === 'sort') return;
    closeDropdown();
  }, [closeDropdown, openDropdown]);

  useEffect(() => {
    window.addEventListener('click', handleDropdown);

    return () => window.removeEventListener('click', handleDropdown);
  }, [handleDropdown]);

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
          className={cn({
            [styles.top__kebab]: true,
            [styles['top__kebab--clicked']]: isOpen,
          })}
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown(String(review_id));
          }}
        >
          {isOpen ? <ClickedKebab /> : <Kebab />}
          {isOpen
            && <SelectButton is_mine={is_mine} review_id={review_id} is_reported={is_reported} />}
        </button>
      </div>
      <div className={styles.rating}>
        <div>
          {ratingList.map((ratio, idx) =>
            // eslint-disable-next-line
            (ratio ? <Star key={idx} /> : <EmptyStar key={idx} />))}
        </div>
        <div className={styles.created}>
          {created_at}
          {is_modified && '(수정됨)'}
        </div>
      </div>
      {is_reported
        ? (
          <div className={styles.reported}>
            <InformationIcon />
            신고에 의해 숨김 처리되었습니다.
          </div>
        ) : (
          <>
            <div className={styles.content}>
              {content}
            </div>
            <div className={styles['image-wrapper']}>
              {image_urls.map((src, idx) => (
                <button
                  key={src}
                  onClick={() => onClickImage(image_urls, idx)}
                  type="button"
                >
                  <img key={src} src={src} alt="메뉴 이미지" className={styles.menu__image} />
                </button>
              ))}
            </div>
            <div className={styles['menu-card']}>
              {
                // eslint-disable-next-line
                menu_names.map((menu, idx) => <div className={styles['menu-card__menu']} key={`${menu} ${idx}`}>{menu}</div>) // 수정, 삭제하지 않음
              }
            </div>
          </>
        )}

    </div>
  );
}
