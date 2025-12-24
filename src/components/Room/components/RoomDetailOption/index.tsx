import Image from 'next/image';
import { cn } from '@bcsdlab/utils';
import OPTION_CATEGORY from 'static/optionCategory';
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
            <Image
              src={option.img_url}
              alt={option.name}
              aria-hidden
              width={70}
              height={70}
              sizes="70px"
              className={styles.option__icon}
            />
            <div className={styles.option__name}>{option.name}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default RoomDetailOption;
