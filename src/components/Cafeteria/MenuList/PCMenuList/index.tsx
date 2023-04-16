import { CafeteriaMenu } from 'api/cafeteria/entity';
import { CafeteriaHeaderType } from 'static/cafeteria';
import cn from 'utils/ts/classnames';
import styles from './PCMenuList.module.scss';

type PCMenuListProps = {
  cafeteriaList: CafeteriaHeaderType[];
  cafeteriaMenus: CafeteriaMenu[];
  time: string;
};

function PCMenuList({ cafeteriaList, cafeteriaMenus, time }: PCMenuListProps) {
  return (
    <div className={styles.list}>
      {cafeteriaList.map((cafeteria) => (
        <div
          className={cn({
            [styles.card]: true,
            [styles['card--another-breakfast']]:
              cafeteria.location !== 'Student-Union' && time === 'BREAKFAST',
            [styles['card--another-lunch']]:
              cafeteria.location !== 'Student-Union' && time === 'LUNCH',
            [styles['card--another-dinner']]:
              cafeteria.location !== 'Student-Union' && time === 'DINNER',
            [styles['card--school-breakfast']]:
              cafeteria.location === 'Student-Union' && time === 'BREAKFAST',
            [styles['card--school-lunch']]:
              cafeteria.location === 'Student-Union' && time === 'LUNCH',
            [styles['card--school-dinner']]:
              cafeteria.location === 'Student-Union' && time === 'DINNER',
          })}
          key={cafeteria.corner}
        >
          {cafeteriaMenus.map((menus) => (
            <div
              className={cn({
                [styles.card__menus]: true,
                [styles['card__menus--isDisabled']]:
                  menus.place !== cafeteria.corner || menus.type !== time,
                [styles['card__menus--another-breakfast']]:
                  cafeteria.location !== 'Student-Union' && time === 'BREAKFAST',
                [styles['card__menus--another-lunch']]:
                  cafeteria.location !== 'Student-Union' && time === 'LUNCH',
                [styles['card__menus--another-dinner']]:
                  cafeteria.location !== 'Student-Union' && time === 'DINNER',
                [styles['card__menus--school-breakfast']]:
                  cafeteria.location === 'Student-Union' && time === 'BREAKFAST',
                [styles['card__menus--school-lunch']]:
                  cafeteria.location === 'Student-Union' && time === 'LUNCH',
                [styles['card__menus--school-dinner']]:
                  cafeteria.location === 'Student-Union' && time === 'DINNER',
              })}
              key={`${menus}`}
            >
              {menus.menu.map((menu) => (
                <div className={styles.card__menu} key={`${menu}`}>
                  {menu}
                </div>
              ))}
              <div className={styles.card__info}>
                {`${menus.kcal}kcal`}
                <br />
                {`${menus.price_card}원/${menus.price_cash}원`}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default PCMenuList;
