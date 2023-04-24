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
  title1: string;
  title2: string;
  value1: string | number | null;
  value2: string | number | null;
  suffix1?: string;
  suffix2?: string;
}

function RoomDetailTable({
  monthlyFee, roomType, charterFee, deposit, floor, managementFee, size, phone,
}: TableProps) {
  const tableData: TableData[] = [
    {
      title1: '월세', value1: monthlyFee, title2: '방 종류', value2: roomType,
    },
    {
      title1: '전세', value1: charterFee, suffix1: '만원', title2: '보증금', value2: deposit, suffix2: '만원',
    },
    {
      title1: '층수', value1: floor, suffix1: '층', title2: '관리비', value2: managementFee,
    },
    {
      title1: '방 크기', value1: size, suffix1: '평', title2: '연락처', value2: phone,
    },
  ];
  return (
    <table className={styles.table}>
      <tbody>
        {tableData.map((data) => (
          <tr className={styles.table__row}>
            <th className={styles.table__title}>{data.title1}</th>
            <td className={styles.table__cell}>{data.value1 ? `${data.value1}${data.suffix1 || ''}` : ' - ' }</td>
            <th className={styles.table__title}>{data.title2}</th>
            <td className={styles.table__cell}>{data.value2 ? `${data.value2}${data.suffix2 || ''}` : ' - ' }</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RoomDetailTable;
