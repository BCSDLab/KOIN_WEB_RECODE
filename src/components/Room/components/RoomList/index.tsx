import Link from 'next/link';
import { LandList } from 'api/room/entity';
import ROUTES from 'static/routes';
import styles from './RoomList.module.scss';

interface RoomListProps {
  lands: LandList[] | undefined;
}

function RoomList(props: RoomListProps) {
  const { lands } = props;
  return (
    <ul className={styles.list}>
      {lands?.map((room) => (
        <li className={styles.list__item} key={room.id}>
          <Link className={styles.list__link} href={ROUTES.RoomDetail({ id: String(room.id), isLink: true })}>
            <div className={styles.list__box}>
              <div className={styles.list__name}>{room.name}</div>
              <div className={styles.fee}>
                <div className={styles.fee__info}>
                  <span className={styles.fee__monthly}>월세</span>
                  <span>{room.monthly_fee ? room.monthly_fee : '정보없음'}</span>
                </div>
                <div className={styles.fee__info}>
                  <span className={styles.fee__charter}>전세</span>
                  <span>{room.charter_fee ? `${room.charter_fee}만원` : ' - '}</span>
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default RoomList;
