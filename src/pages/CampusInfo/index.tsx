import { cn } from '@bcsdlab/utils';
import useCampusInfo from './hooks/useCampusInfo';
import styles from './CampusInfo.module.scss';
import { ReactComponent as Book } from './svg/book.svg';
import { ReactComponent as Cafe } from './svg/cafe.svg';
import { ReactComponent as Cut } from './svg/cut.svg';
import { ReactComponent as Flatware } from './svg/flatware.svg';
import { ReactComponent as Laundry } from './svg/laundry.svg';
import { ReactComponent as PostOffice } from './svg/post-office.svg';
import { ReactComponent as Print } from './svg/print.svg';

const CAFETERIA_HEAD_TABLE = {
  row: ['평일', '주말'],
  col: ['아침', '점심', '저녁'],
};

const SHOP_ICON = {
  서점: <Book />,
  대즐: <Cafe />,
  미용실: <Cut />,
  세탁소: <Laundry />,
  우체국: <PostOffice />,
  '복지관 참빛관 편의점': <Cafe />,
  복사실: <Print />,
  학생식당: <Flatware />,
  복지관식당: <Flatware />,
};

const formatDateRange = (fromDate: string, toDate: string) => {
  const from = new Date(fromDate);
  const to = new Date(toDate);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const fromFormatted = from.toLocaleDateString('ko-KR', options);
  let toFormatted = to.toLocaleDateString('ko-KR', options);

  if (from.getFullYear() === to.getFullYear()) {
    const toOptions: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
    };

    toFormatted = to.toLocaleDateString('ko-KR', toOptions);
  }

  return `기간 : ${fromFormatted} - ${toFormatted}`;
};

function CampusInfo() {
  const { campusInfo } = useCampusInfo();

  const cafeteriaInfo = campusInfo?.coop_shops.find((shop) => shop.name === '학생식당');
  const filteredCampusInfo = campusInfo?.coop_shops.filter((shop) => shop.name !== '학생식당');

  const getFormattedShopTime = (open: string, close: string) => {
    if (open === close) {
      return open;
    }

    return `${open} - ${close}`;
  };

  const getTimeToTypeAndDay = (type: string, day: string) => {
    const target = cafeteriaInfo?.opens
      ?.find((open) => open.day_of_week === day && open.type === type);

    return target ? getFormattedShopTime(target.open_time, target.close_time) : '미운영';
  };

  return (
    <div className={styles.container}>
      <div className={styles['title-container']}>
        <h2 className={styles.title}>{`${campusInfo.semester} 시설물 운영 시간`}</h2>
        <div className={styles.subtitle}>
          {formatDateRange(campusInfo.from_date, campusInfo.to_date)}
        </div>
      </div>
      <section className={styles['info-container']}>
        <div className={styles['info-column']}>
          <div className={styles['info-block']}>
            <div className={styles['info-cafeteria']}>
              <div className={styles['info-title-container']}>
                <div className={styles['icon-wrapper']}>
                  <Flatware />
                </div>
                <div className={styles['info-title']}>학생식당</div>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr className={styles['table-head__tr']}>
                    <th>시간</th>
                    {CAFETERIA_HEAD_TABLE.row.map((type) => (
                      <th className={styles['table-head__th']} key={type}>{type}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CAFETERIA_HEAD_TABLE.col.map((type) => (
                    <tr className={styles['table-body__tr']} key={type}>
                      <td className={styles['table-body__td']}>{type}</td>
                      {CAFETERIA_HEAD_TABLE.row.map((day) => (
                        <td
                          className={cn({
                            [styles['table-body__td']]: true,
                            [styles.closed]:
                              getTimeToTypeAndDay(type, day) === '미운영',
                          })}
                          key={`${type}-${day}`}
                        >
                          {getTimeToTypeAndDay(type, day)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredCampusInfo.slice(0, 1).map(({ id, name, opens }) => (
            <div className={styles['info-block']} key={id}>
              <div className={styles['icon-wrapper']}>
                {SHOP_ICON[name as keyof typeof SHOP_ICON]}
              </div>
              <div className={styles['info-description-container']}>
                <div className={styles['info-title']}>{name}</div>
                {opens.map(({ day_of_week, open_time, close_time }) => (
                  <div className={styles['info-description']} key={`${id}-${day_of_week}`}>{`${day_of_week}: ${getFormattedShopTime(open_time, close_time)}`}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles['info-column']}>
          {filteredCampusInfo.slice(1, 4).map(({ id, name, opens }) => (
            <div className={styles['info-block']} key={id}>
              <div className={styles['icon-wrapper']}>
                {SHOP_ICON[name as keyof typeof SHOP_ICON]}
              </div>
              <div className={styles['info-description-container']}>
                <div className={styles['info-title']}>{name}</div>
                {opens.map(({ day_of_week, open_time, close_time }) => (
                  <div className={styles['info-description']} key={`${id}-${day_of_week}`}>{`${day_of_week}: ${getFormattedShopTime(open_time, close_time)}`}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles['info-column']}>
          {filteredCampusInfo.slice(4, -1).map(({ id, name, opens }) => (
            <div className={styles['info-block']} key={id}>
              <div className={styles['icon-wrapper']}>
                {SHOP_ICON[name as keyof typeof SHOP_ICON]}
              </div>
              <div className={styles['info-description-container']}>
                <div className={styles['info-title']}>{name}</div>
                {opens.map(({ day_of_week, open_time, close_time }) => (
                  <div className={styles['info-description']} key={`${id}-${day_of_week}`}>{`${day_of_week}: ${getFormattedShopTime(open_time, close_time)}`}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CampusInfo;
