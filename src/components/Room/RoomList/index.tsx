import { LandList } from 'api/room/entity';
import styles from './RoomList.module.scss';

interface LandListProps {
  lands: LandList[] | undefined;
}

function RoomList(props: LandListProps) {
  const { lands } = props;
  return (
    <div className={styles.list}>
      {lands?.map((room) => (
        <div className={styles.list__box} key={room.id}>
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
      ))}
    </div>
  );
}

export default RoomList;
