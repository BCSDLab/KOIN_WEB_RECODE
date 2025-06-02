import { useParams } from 'react-router-dom';
import LikeIcon from 'assets/svg/Club/like-icon.svg';
import NonLikeIcon from 'assets/svg/Club/unlike-icon.svg';
import useClubDetail from './hooks/useClubdetail';
import styles from './ClubDetailPage.module.scss';

export default function ClubDetailPage() {
  const { id } = useParams();
  const { clubDetail } = useClubDetail(id);

  return (
    <div className={styles.layout}>
      <div className={styles['club-detail__summary']}>
        <div className={styles['club-detail__text-container']}>
          <h1 className={styles['club-detail__summary__title']}>{clubDetail.name}</h1>
          <div className={styles['club-detail__summary__row']}>
            분과:
            {' '}
            {clubDetail.category}
            {' '}
            분과
          </div>
          <div className={styles['club-detail__summary__row']}>
            동아리 방 위치:
            {clubDetail.location}
          </div>
          <div className={styles['club-detail__summary__row']}>
            동아리 소개:
            {clubDetail.description}
          </div>
          <div className={styles['club-detail__summary__contacts']}>
            <div className={styles['club-detail__summary__contacts__row']}>
              인스타:
              <a
                href={`https://www.instagram.com/${clubDetail.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['club-detail__summary__contacts__row__link']}
              >
                @
                {clubDetail.instagram}
              </a>
            </div>
          </div>
        </div>
        <div className={styles['club-detail__summary__image-container']}>
          {clubDetail.image_url ? (
            <img
              className={styles['club-detail__summary__image']}
              src={clubDetail.image_url}
              alt={`${clubDetail.name} 동아리 이미지`}
            />
          ) : (
            <div className={styles['club-detail__image-placeholder']}>
              <p>동아리 이미지가 없습니다.</p>
            </div>
          )}
          <div className={styles['club-detail__like']}>
            {clubDetail.is_liked ? <LikeIcon /> : <NonLikeIcon />}
            <span className={styles['club-detail__like-count']}>
              {clubDetail.likes || 0}
            </span>
            <span className={styles['club-detail__like-text']}>개</span>
          </div>
        </div>
      </div>
    </div>
  );
}
