/* eslint-disable no-param-reassign */
import { Dining, DiningType } from 'interfaces/Cafeteria';
import { useEffect, useRef, useState } from 'react';
import useLogger from 'utils/hooks/useLogger';
import { useDatePicker } from 'pages/Cafeteria/hooks/useDatePicker';
import useDinings from 'pages/Cafeteria/hooks/useDinings';
import DetailModal from 'pages/Cafeteria/PCCafeteriaPage/components/DetailModal';
import PCMealImage from 'pages/Cafeteria/PCCafeteriaPage/components/PCMealImage';
import { DINING_TYPE_MAP } from 'static/cafeteria';
import useBooleanState from 'utils/hooks/useBooleanState';
import { filterDinings } from 'utils/ts/cafeteria';
import styles from './PCDiningBlocks.module.scss';

interface Props {
  diningType: DiningType;
  isThisWeek: boolean;
}

export default function PCDiningBlocks({ diningType, isThisWeek }: Props) {
  const { currentDate } = useDatePicker();
  const { dinings } = useDinings(currentDate);
  const filteredDinings = filterDinings(dinings, diningType);

  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boxRef.current) {
      const blocks = boxRef.current.children;
      const columnHeights = [0, 0, 0];
      let columnIndex = 0;

      Array.from(blocks).forEach((block) => {
        const x = columnIndex * (276 + 16); // 열 인덱스에 따라 x 위치 계산
        const y = columnHeights[columnIndex]; // 현재 열의 높이에서 시작
        (block as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
        columnHeights[columnIndex] += (block as HTMLElement).clientHeight + 16; // 열 높이 업데이트
        columnIndex = (columnIndex + 1) % columnHeights.length; // 다음 열 인덱스로 업데이트
      });

      boxRef.current.style.height = `${Math.max(...columnHeights)}px`; // 컨테이너의 높이 업데이트
    }
  }, [filteredDinings]);

  const logger = useLogger();
  const [selectedDining, setSelectedDining] = useState<Dining | null>(null);
  const [isModalOpen, setIsModalOpenTrue, setIsModalOpenFalse] = useBooleanState(false);
  const handleImageClick = (dining: Dining) => {
    if (!dining.image_url) return;

    logger.actionEventClick({
      actionTitle: 'CAMPUS',
      title: 'menu_image',
      value: `${DINING_TYPE_MAP[dining.type]}_${dining.place}`,
    });
    setSelectedDining(dining);
    setIsModalOpenTrue();
  };

  useEffect(() => {
    const body = document.querySelector('body');
    if (isModalOpen) {
      body!.style.overflow = 'hidden';
    } else {
      body!.style.overflow = 'auto';
    }
  }, [isModalOpen]);

  return (
    <>
      {isModalOpen && (
        <DetailModal dining={selectedDining} closeModal={setIsModalOpenFalse} />
      )}

      <div ref={boxRef}>
        {filteredDinings.map((dining) => (
          <div className={styles.block} key={dining.id}>
            <div className={styles.header}>
              <div className={styles.header__place}>{dining.place}</div>
              <div className={styles.header__detail}>
                {!!dining.kcal && `${dining.kcal}kcal`}
                {!!dining.kcal && !!dining.price_card && !!dining.price_cash && '•'}
                {!!dining.price_card && !!dining.price_cash && `${dining.price_card}원/${dining.price_cash}원`}
              </div>
              {dining.soldout_at && <span className={`${styles.header__chip} ${styles['header__chip--sold-out']}`}>품절</span>}
              {!dining.soldout_at && dining.changed_at && <span className={`${styles.header__chip} ${styles['header__chip--changed']}`}>변경됨</span>}
            </div>

            <div className={styles.content}>
              <PCMealImage
                dining={dining}
                isThisWeek={isThisWeek}
                handleImageClick={handleImageClick}
              />
              <div className={styles.content__menu}>
                {dining.menu.map((menuItem) => (
                  <div key={menuItem.id}>{menuItem.name}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
