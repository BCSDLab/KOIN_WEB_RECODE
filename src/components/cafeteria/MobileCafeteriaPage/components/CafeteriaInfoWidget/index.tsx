import { cn } from '@bcsdlab/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { coopshopQueries } from 'api/coopshop/queries';
import CafeteriaInfo from 'components/cafeteria/components/CafeteriaInfo';
import useCafeteriaInfoParam from 'components/cafeteria/hooks/useCafeteriaInfoParam';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';

import styles from 'components/cafeteria/MobileCafeteriaPage/MobileCafeteriaPage.module.scss';

export default function CafeteriaInfoWidget() {
  const { data: cafeteriaInfo } = useSuspenseQuery(coopshopQueries.cafeteriaInfo());
  const { isOpen: isCafeteriaInfoOpen, close: closeCafeteriaInfo } = useCafeteriaInfoParam();
  useBodyScrollLock(isCafeteriaInfoOpen);

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
