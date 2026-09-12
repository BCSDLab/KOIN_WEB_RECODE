import { useEffect, useRef } from 'react';
import { Dining, DiningType } from 'api/dinings/entity';
import { useCafeteriaParams } from 'components/cafeteria/hooks/useCafeteriaParams';
import useDinings from 'components/cafeteria/hooks/useDinings';
import DetailModal from 'components/cafeteria/PCCafeteriaPage/components/DetailModal';
import PCMealImage from 'components/cafeteria/PCCafeteriaPage/components/PCMealImage';
import { filterDinings } from 'components/cafeteria/utils/filter';
import { Portal } from 'components/modal/Modal/PortalProvider';
import { DINING_TYPE_MAP } from 'static/cafeteria';
import useLogger from 'utils/hooks/analytics/useLogger';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import styles from './PCDiningBlocks.module.scss';

interface PCDiningBlocksProps {
  diningType: DiningType;
  isThisWeek: boolean;
}

export default function PCDiningBlocks({ diningType, isThisWeek }: PCDiningBlocksProps) {
  const logger = useLogger();
  const portalManager = useModalPortal();
  const { date } = useCafeteriaParams();
  const { dinings } = useDinings(date.current());
  const filteredDinings = filterDinings(dinings, diningType);
  const boxRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (dining: Dining) => {
    if (!dining.image_url) return;

    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'menu_image',
      value: `${DINING_TYPE_MAP[dining.type]}_${dining.place}`,
    });

    portalManager.open((portalOption: Portal) => <DetailModal dining={dining} closeModal={portalOption.close} />);
  };

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    // 읽기(clientHeight)와 쓰기(style.transform)를 한 루프에서 번갈아 하면, 쓰기 직후의
    // 읽기마다 브라우저가 레이아웃을 강제로 다시 계산한다(forced synchronous layout).
    // 블록 수만큼 반복되는 불필요한 리플로우라 먼저 전부 읽고, 그다음 전부 쓴다.
    const blocks = Array.from(box.children) as HTMLElement[];
    const blockHeights = blocks.map((block) => block.clientHeight);

    const columnHeights = [0, 0, 0];
    blocks.forEach((block, index) => {
      const columnIndex = index % columnHeights.length;
      const x = columnIndex * (276 + 16); // 열 인덱스에 따라 x 위치 계산
      const y = columnHeights[columnIndex]; // 현재 열의 높이에서 시작
      block.style.transform = `translate(${x}px, ${y}px)`;
      columnHeights[columnIndex] += blockHeights[index] + 16; // 열 높이 업데이트
    });

    box.style.height = `${Math.max(...columnHeights)}px`; // 컨테이너의 높이 업데이트
  }, [filteredDinings]);

  return (
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
            {dining.soldout_at && (
              <span className={`${styles.header__chip} ${styles['header__chip--sold-out']}`}>품절</span>
            )}
            {!dining.soldout_at && dining.changed_at && (
              <span className={`${styles.header__chip} ${styles['header__chip--changed']}`}>변경됨</span>
            )}
          </div>

          <div className={styles.content}>
            <PCMealImage dining={dining} isThisWeek={isThisWeek} handleImageClick={handleImageClick} />
            <div className={styles.content__menu}>
              {dining.menu.map((menuItem) => (
                <div key={menuItem.id}>{menuItem.name}</div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
