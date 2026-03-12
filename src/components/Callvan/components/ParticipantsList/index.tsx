import { useRouter } from 'next/router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CallvanParticipant } from 'api/callvan/entity';
import { callvanQueries } from 'api/callvan/queries';
import ArrowBackIcon from 'assets/svg/Callvan/arrow-back.svg';
import NotificationBellIcon from 'assets/svg/Callvan/notification.svg';
import PeopleIcon from 'assets/svg/Callvan/people.svg';
import RouteIndicatorIcon from 'assets/svg/Callvan/route-indicator.svg';
import SirenIcon from 'assets/svg/Callvan/siren.svg';
import ThreeDotsIcon from 'assets/svg/Callvan/three-dots-small.svg';
import { getParticipantColor } from 'components/Callvan/utils/participantColor';
import { DAYS } from 'static/day';
import ROUTES from 'static/routes';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { ParticipantAvatarFilledIcon, ParticipantAvatarIcon } from './ParticipantAvatarIcon';
import styles from './ParticipantsList.module.scss';

function getDayOfWeek(dateStr: string): string {
  const date = new Date(dateStr);
  return DAYS[date.getDay()];
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split('-');
  const month = parts[1];
  const day = parts[2];
  const dayOfWeek = getDayOfWeek(dateStr);
  return `${month}.${day} (${dayOfWeek})`;
}

function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5);
}

interface ParticipantAvatarProps {
  participant: CallvanParticipant;
  colorIndex: number;
}

function ParticipantAvatar({ participant, colorIndex }: ParticipantAvatarProps) {
  if (participant.is_me) {
    return <ParticipantAvatarFilledIcon />;
  }

  return <ParticipantAvatarIcon color={getParticipantColor(colorIndex)} />;
}

interface ParticipantRowProps {
  participant: CallvanParticipant;
  colorIndex: number;
  onReport: () => void;
}

function ParticipantRow({ participant, colorIndex }: ParticipantRowProps) {
  const [isMenuOpen, , closeMenu, toggleMenu] = useBooleanState(false);
  const { containerRef } = useOutsideClick<HTMLDivElement>({
    onOutsideClick: closeMenu,
  });
  const router = useRouter();
  const postId = Number(router.query.postId);

  return (
    <div className={styles['participant-row']}>
      <div className={styles['participant-row__left']}>
        <ParticipantAvatar participant={participant} colorIndex={colorIndex} />
        <span className={styles['participant-row__name']}>
          {participant.nickname}
          {participant.is_me && <span className={styles['participant-row__me']}> (나)</span>}
        </span>
      </div>

      {!participant.is_me && (
        <div className={styles['participant-row__menu-wrapper']} ref={containerRef}>
          <button
            type="button"
            className={`${styles['participant-row__menu-button']} ${isMenuOpen ? styles['participant-row__menu-button--active'] : ''}`}
            onClick={toggleMenu}
            aria-label="더보기"
          >
            <ThreeDotsIcon />
          </button>
          {isMenuOpen && (
            <div className={styles['participant-row__dropdown']}>
              <button
                type="button"
                className={styles['participant-row__dropdown-item']}
                onClick={() =>
                  router.push(ROUTES.CallvanReport({ postId: String(postId), userId: String(participant.user_id) }))
                }
              >
                <SirenIcon />
                <span>신고하기</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ParticipantsListProps {
  postId: number;
  token: string;
}

export default function ParticipantsList({ postId, token }: ParticipantsListProps) {
  const router = useRouter();

  const { data: post } = useSuspenseQuery(callvanQueries.postDetail(token, postId));

  const colorIndexMap = new Map(post.participants.filter((p) => !p.is_me).map((p, i) => [p.user_id, i]));

  return (
    <div className={styles.page}>
      <div className={styles.page__header}>
        <button
          type="button"
          className={styles['page__back-button']}
          onClick={() => router.back()}
          aria-label="뒤로가기"
        >
          <ArrowBackIcon />
        </button>
        <h1 className={styles.page__title}>콜밴팟</h1>
        <button
          type="button"
          className={styles['page__notification-button']}
          onClick={() => router.push(ROUTES.CallvanNotifications())}
          aria-label="알림"
        >
          <NotificationBellIcon />
        </button>
      </div>

      <div className={styles['page__info-bar']}>
        <span className={styles['page__info-title']}>참여자 리스트</span>
        <div className={styles['page__info-count']}>
          <PeopleIcon />
          <span>
            {post.current_participants}/{post.max_participants}
          </span>
        </div>
      </div>

      <div className={styles.page__content}>
        <div className={styles['route-card']}>
          <div className={styles['route-card__indicator']}>
            <RouteIndicatorIcon />
          </div>
          <div className={styles['route-card__locations']}>
            <div className={styles['route-card__location']}>
              <span className={styles['route-card__label']}>출발:</span>
              <span className={styles['route-card__value']}>{post.departure}</span>
            </div>
            <div className={styles['route-card__location']}>
              <span className={styles['route-card__label']}>도착:</span>
              <span className={styles['route-card__value']}>{post.arrival}</span>
            </div>
          </div>
          <div className={styles['route-card__datetime']}>
            <span>{formatDate(post.departure_date)}</span>
            <span>{formatTime(post.departure_time)}</span>
          </div>
        </div>

        <div className={styles['participants-list']}>
          {post.participants.map((participant, index) => (
            <div key={participant.user_id}>
              {index > 0 && <div className={styles['participants-list__divider']} />}
              <ParticipantRow
                participant={participant}
                colorIndex={colorIndexMap.get(participant.user_id) ?? 0}
                onReport={() =>
                  router.push(ROUTES.CallvanReport({ postId: String(postId), userId: String(participant.user_id) }))
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.page__footer}>
        <div className={styles.page__divider} />
        <button type="button" className={styles['page__chat-button']}>
          단체 채팅방 입장
        </button>
      </div>
    </div>
  );
}
