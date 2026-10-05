import { useQuery } from '@tanstack/react-query';
import { coopshopQueries } from 'api/coopshop/queries';
import InformationIcon from 'assets/svg/common/information/information-icon-grey.svg';
import useCafeteriaInfoParam from 'components/cafeteria/hooks/useCafeteriaInfoParam';
import HeaderIconButton from 'components/ui/PageHeader/HeaderIconButton';

export default function CafeteriaInfoButton() {
  const { data: cafeteriaInfo } = useQuery(coopshopQueries.cafeteriaInfo());
  const { open } = useCafeteriaInfoParam();

  // 운영 정보를 못 받으면 안내 패널이 그려지지 않으므로 버튼도 숨긴다
  if (!cafeteriaInfo) return null;

  return (
    <HeaderIconButton aria-label="학생식당 운영 정보 안내" onClick={open}>
      <InformationIcon />
    </HeaderIconButton>
  );
}
