import type { Review } from 'api/storeMobile/entity';
import CheckBookmarkIcon from 'assets/svg/Store/check-bookmark.svg';
import NoImageIcon from 'assets/svg/Store/no-image-icon.svg';
import StarList from 'components/Store/mobile/StoreReviewsPage/components/StarList';
import { formatReviewDate } from 'components/Store/mobile/StoreReviewsPage/utils/formatReviewDate';
import Button from 'components/ui/Button';

import styles from './ReviewCard.module.scss';

// 전체 목록(storeMobile)과 내 리뷰(api/store) 응답을 함께 받는다. 내 리뷰 응답은 is_reported가 없을 수 있다
export type ReviewCardItem = Omit<Review, 'is_reported'> & { is_reported?: boolean };

interface ReviewCardProps {
  review: ReviewCardItem;
  onEdit: (reviewId: number) => void;
  onDelete: (reviewId: number) => void;
  onReport: (reviewId: number) => void;
  onImageClick: (url: string) => void;
}

// KOIN_ORDER_WEBVIEW pages/Shop/components/ReviewCard 이전
export default function ReviewCard({ review, onEdit, onDelete, onReport, onImageClick }: ReviewCardProps) {
  const { rating, nick_name, content, image_urls, menu_names, is_mine, is_reported, created_at, review_id } = review;

  if (is_reported) {
    return (
      <div className={styles.reported}>
        <NoImageIcon className={styles.reported__icon} />
        <span className={styles.reported__text}>신고에 의해 숨김 처리 되었습니다.</span>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      {is_mine && (
        <div className={styles.card__mine}>
          <CheckBookmarkIcon className={styles['card__mine-icon']} />
          <span>내가 작성한 리뷰</span>
        </div>
      )}
      <div className={styles.card__header}>
        <span className={styles.card__nickname}>{nick_name}</span>
        {is_mine ? (
          <div className={styles.card__actions}>
            <Button color="darkGray" size="sm" className={styles.card__action} onClick={() => onEdit(review_id)}>
              수정
            </Button>
            <Button color="darkGray" size="sm" className={styles.card__action} onClick={() => onDelete(review_id)}>
              삭제
            </Button>
          </div>
        ) : (
          <button type="button" className={styles.card__report} onClick={() => onReport(review_id)}>
            신고하기
          </button>
        )}
      </div>
      <div className={styles.card__meta}>
        <StarList rating={rating} />
        <span>{formatReviewDate(created_at)}</span>
      </div>
      <span className={styles.card__content}>{content}</span>
      {image_urls?.length > 0 && (
        <div className={styles.card__images}>
          {image_urls.map((url) => (
            <button key={url} type="button" className={styles['card__image-button']} onClick={() => onImageClick(url)}>
              {/* eslint-disable-next-line @next/next/no-img-element -- 리뷰 이미지는 외부 업로드 URL을 order처럼 그대로 그린다 */}
              <img src={url} alt={content} className={styles.card__image} />
            </button>
          ))}
        </div>
      )}

      {menu_names?.length > 0 && (
        <div className={styles.card__menus}>
          {menu_names.map((name) => (
            <span key={name} className={styles.card__menu}>
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
