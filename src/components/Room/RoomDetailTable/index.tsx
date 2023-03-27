import styles from './RoomDetailTable.module.scss';

interface TableProps {
  monthlyFee: string
  roomType: string
  charterFee: string
  deposit: string
  floor: null | number
  managementFee: string
  size: number
  phone: string
}

function RoomDetailTable({
  monthlyFee, roomType, charterFee, deposit, floor, managementFee, size, phone,
}: TableProps) {
  return (
    <table className={styles.table}>
      <tbody>
        <tr>
          <th className={styles.table__title}>월세</th>
          <td className={styles.table__cell}>{monthlyFee || ' - ' }</td>
          <th className={styles.table__title}>방 종류</th>
          <td className={styles.table__cell}>{roomType || ' - '}</td>
        </tr>
        <tr className={styles.table__row}>
          <th className={styles.table__title}>전세</th>
          <td className={styles.table__cell}>{charterFee ? `${charterFee}만원` : ' - '}</td>
          <th className={styles.table__title}>보증금</th>
          <td className={styles.table__cell}>{deposit ? `${deposit}만원` : ' - '}</td>
        </tr>
        <tr className={styles.table__row}>
          <th className={styles.table__title}>층수</th>
          <td className={styles.table__cell}>{floor ? `${floor}층` : ' - '}</td>
          <th className={styles.table__title}>관리비</th>
          <td className={styles.table__cell}>{managementFee || ' - '}</td>
        </tr>
        <tr className={styles.table__row}>
          <th className={styles.table__title}>방 크기</th>
          <td className={styles.table__cell}>{size ? `${size}평` : ' - '}</td>
          <th className={styles.table__title}>연락처</th>
          <td className={styles.table__cell}>{phone || ' - '}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default RoomDetailTable;
