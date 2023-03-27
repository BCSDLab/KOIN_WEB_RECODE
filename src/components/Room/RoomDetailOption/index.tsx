import { LandDetailResponse } from 'api/room/entity';
import OPTION_CATEGORY from 'static/optionCategory';
import cn from 'utils/ts/classnames';
import styles from './RoomDetailOption.module.scss';

interface OptionProps {
  roomDetail: LandDetailResponse
}

function RoomDetailOption({ roomDetail }: OptionProps) {
  return (
    <ul className={styles.option}>
      {OPTION_CATEGORY.map((option) => (
        <li className={styles.option__list} key={option.id}>
          <div className={cn({
            [styles.option__builtIn]: roomDetail?.
              [option.img_code as keyof LandDetailResponse] === true,
            [styles.option__builtNot]: roomDetail?.
              [option.img_code as keyof LandDetailResponse] === false,
          })}
          >
            <img src={option.img_url} alt="옵션 이미지" />
            <div className={styles.option__name}>
              {option.name}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default RoomDetailOption;
