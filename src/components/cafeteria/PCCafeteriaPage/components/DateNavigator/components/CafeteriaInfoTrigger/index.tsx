import { useSuspenseQuery } from '@tanstack/react-query';
import { coopshopQueries } from 'api/coopshop/queries';
import InformationIcon from 'assets/svg/common/information/information-icon-grey.svg';
import CafeteriaInfo from 'components/cafeteria/components/CafeteriaInfo';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import styles from 'components/cafeteria/PCCafeteriaPage/components/DateNavigator/DateNavigator.module.scss';

export default function CafeteriaInfoTrigger() {
  const portalManager = useModalPortal();
  const { data: cafeteriaInfo } = useSuspenseQuery(coopshopQueries.cafeteriaInfo());

  const handleInformationClick = () => {
    portalManager.open(() => <CafeteriaInfo cafeteriaInfo={cafeteriaInfo} closeInfo={portalManager.close} />);
  };

  return (
    <button type="button" className={styles.information} onClick={handleInformationClick}>
      <InformationIcon />
      학생식당정보
    </button>
  );
}
