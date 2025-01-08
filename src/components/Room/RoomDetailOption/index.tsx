import OPTION_CATEGORY from 'static/optionCategory';
import { cn } from '@bcsdlab/utils';
import styles from './RoomDetailOption.module.scss';

type RoomDetailOptionProps = {
  [key in (typeof OPTION_CATEGORY)[number]['img_code']]: boolean;
};

function RoomDetailOption({ roomOptions }: { roomOptions: RoomDetailOptionProps }) {
  return (
    <ul className={styles.option}>
      {OPTION_CATEGORY.map((option) => (
        <li className={styles.option__list} key={option.id}>
          <div
            className={cn({
              [styles.option__item]: true,
              [styles['option__item--unchecked']]: !roomOptions[option.img_code],
            })}
          >
            <img src={option.img_url} alt="옵션 이미지" />
            <div className={styles.option__name}>{option.name}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default RoomDetailOption;
