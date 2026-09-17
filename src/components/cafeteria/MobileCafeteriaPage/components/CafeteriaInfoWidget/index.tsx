import { useEffect } from 'react';
import { cn } from '@bcsdlab/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { coopshopQueries } from 'api/coopshop/queries';
import InformationIcon from 'assets/svg/common/information/information-icon-white.svg';
import CafeteriaInfo from 'components/cafeteria/components/CafeteriaInfo';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import { useHeaderButtonStore } from 'utils/zustand/headerButtonStore';
import styles from 'components/cafeteria/MobileCafeteriaPage/MobileCafeteriaPage.module.scss';

export default function CafeteriaInfoWidget() {
  const { data: cafeteriaInfo } = useSuspenseQuery(coopshopQueries.cafeteriaInfo());
  const [isCafeteriaInfoOpen, openCafeteriaInfo, closeCafeteriaInfo] = useBooleanState(false);
  const setButtonContent = useHeaderButtonStore((state) => state.setButtonContent);
  useBodyScrollLock(isCafeteriaInfoOpen);

  useEffect(() => {
    setButtonContent(
      <button type="button" aria-label="학생식당 운영 정보 안내" onClick={openCafeteriaInfo}>
        <InformationIcon />
      </button>,
    );
  }, [setButtonContent, openCafeteriaInfo]);

  return (
    <div
      className={cn({
        [styles['cafeteria-info']]: true,
        [styles['cafeteria-info--open']]: isCafeteriaInfoOpen,
      })}
    >
      <CafeteriaInfo cafeteriaInfo={cafeteriaInfo} closeInfo={closeCafeteriaInfo} />
    </div>
  );
}
