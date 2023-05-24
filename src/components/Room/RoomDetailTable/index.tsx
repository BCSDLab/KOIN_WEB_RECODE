import styles from './RoomDetailTable.module.scss';

interface TableProps {
  monthlyFee: string;
  roomType: string;
  charterFee: string;
  deposit: string;
  floor: null | number;
  managementFee: string;
  size: number;
  phone: string;
}

interface TableData {
  leftTitle: string;
  rightTitle: string;
  leftValue: string | number | null;
  rightValue: string | number | null;
  leftSuffix?: string;
  rightSuffix?: string;
}

function RoomDetailTable({
  monthlyFee, roomType, charterFee, deposit, floor, managementFee, size, phone,
}: TableProps) {
  const tableData: TableData[] = [
    {
      leftTitle: '월세', leftValue: monthlyFee, rightTitle: '방 종류', rightValue: roomType,
    },
    {
      leftTitle: '전세', leftValue: charterFee, leftSuffix: '만원', rightTitle: '보증금', rightValue: deposit, rightSuffix: '만원',
    },
    {
      leftTitle: '층수', leftValue: floor, leftSuffix: '층', rightTitle: '관리비', rightValue: managementFee,
    },
    {
      leftTitle: '방 크기', leftValue: size, leftSuffix: '평', rightTitle: '연락처', rightValue: phone,
    },
  ];
  return (
    <table className={styles.table}>
      <tbody>
        {tableData.map((data) => (
          <tr key={data.leftTitle} className={styles.table__row}>
            <th className={styles.table__title}>{data.leftTitle}</th>
            <td className={styles.table__cell}>{data.leftValue ? `${data.leftValue}${data.leftSuffix || ''}` : ' - ' }</td>
            <th className={styles.table__title}>{data.rightTitle}</th>
            <td className={styles.table__cell}>{data.rightValue ? `${data.rightValue}${data.rightSuffix || ''}` : ' - ' }</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RoomDetailTable;
