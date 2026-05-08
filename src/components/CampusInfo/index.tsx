import { cn } from '@bcsdlab/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { coopshopQueries } from 'api/coopshop/queries';
import styles from './CampusInfo.module.scss';

const CAFETERIA_HEAD_TABLE = {
  row: ['평일', '주말'],
  col: ['아침', '점심', '저녁'],
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

type ShopIconProps = {
  readonly iconUrl: string | null | undefined;
  readonly name: string;
};

function ShopIcon({ iconUrl, name }: ShopIconProps) {
  return (
    <div className={styles['icon-wrapper']}>
      {iconUrl ? (
        // NOTE: 백엔드가 내려주는 소형 반복 아이콘은 호스트가 고정되지 않을 수 있어 <img>를 유지합니다.
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles['icon-image']} src={iconUrl} alt={name} decoding="async" />
      ) : (
        <span className={styles['icon-fallback']} aria-hidden="true">
          {name.slice(0, 1)}
        </span>
      )}
    </div>
  );
}

function CampusInfo() {
  const { data: campusInfo } = useSuspenseQuery(coopshopQueries.allShopInfo());

  const cafeteriaInfo = campusInfo?.coop_shops.find((shop) => shop.name === '학생식당');
  const filteredCampusInfo = campusInfo?.coop_shops.filter((shop) => shop.name !== '학생식당');

  const getFormattedShopTime = (open: string, close: string) => {
    if (open === close) {
      return open;
    }

    return `${open} - ${close}`;
  };

  const getTimeToTypeAndDay = (type: string, day: string) => {
    const target = cafeteriaInfo?.opens?.find((open) => open.day_of_week === day && open.type === type);

    return target ? getFormattedShopTime(target.open_time, target.close_time) : '미운영';
  };

  return (
    <div className={styles.container}>
      <div className={styles['title-container']}>
        <h2 className={styles.title}>{`${campusInfo.semester} 시설물 운영 시간`}</h2>
        <div className={styles.subtitle}>{formatDateRange(campusInfo.from_date, campusInfo.to_date)}</div>
      </div>
      <section className={styles['info-container']}>
        <div className={styles['info-column']}>
          <div className={styles['info-block']}>
            <div className={styles['info-cafeteria']}>
              <div className={styles['info-title-container']}>
                <ShopIcon iconUrl={cafeteriaInfo?.icon_url} name={cafeteriaInfo?.name ?? '학생식당'} />
                <div className={styles['info-title']}>{cafeteriaInfo?.name ?? '학생식당'}</div>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr className={styles['table-head__tr']}>
                    <th>시간</th>
                    {CAFETERIA_HEAD_TABLE.row.map((type) => (
                      <th className={styles['table-head__th']} key={type}>
                        {type}
                      </th>
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
                            [styles.closed]: getTimeToTypeAndDay(type, day) === '미운영',
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

          {filteredCampusInfo.slice(0, 2).map(({ id, name, opens, icon_url }) => (
            <div className={styles['info-block']} key={id}>
              <ShopIcon iconUrl={icon_url} name={name} />
              <div className={styles['info-description-container']}>
                <div className={styles['info-title']}>{name}</div>
                {opens.map(({ day_of_week, open_time, close_time }) => (
                  <div
                    className={styles['info-description']}
                    key={`${id}-${day_of_week}`}
                  >{`${day_of_week}: ${getFormattedShopTime(open_time, close_time)}`}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles['info-column']}>
          {filteredCampusInfo.slice(2, 6).map(({ id, name, opens, icon_url }) => (
            <div className={styles['info-block']} key={id}>
              <ShopIcon iconUrl={icon_url} name={name} />
              <div className={styles['info-description-container']}>
                <div className={styles['info-title']}>{name}</div>
                {opens.map(({ day_of_week, open_time, close_time }) => (
                  <div
                    className={styles['info-description']}
                    key={`${id}-${day_of_week}`}
                  >{`${day_of_week}: ${getFormattedShopTime(open_time, close_time)}`}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles['info-column']}>
          {filteredCampusInfo.slice(6).map(({ id, name, opens, icon_url }) => (
            <div className={styles['info-block']} key={id}>
              <ShopIcon iconUrl={icon_url} name={name} />
              <div className={styles['info-description-container']}>
                <div className={styles['info-title']}>{name}</div>
                {opens.map(({ day_of_week, open_time, close_time }) => (
                  <div
                    className={styles['info-description']}
                    key={`${id}-${day_of_week}`}
                  >{`${day_of_week}: ${getFormattedShopTime(open_time, close_time)}`}</div>
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
