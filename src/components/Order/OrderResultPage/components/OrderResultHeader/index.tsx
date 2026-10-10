import StoreMobileHeader from 'components/Store/mobile/common/StoreMobileHeader';

import styles from './OrderResultHeader.module.scss';

interface OrderResultHeaderProps {
  onClose: () => void;
}

// order 결과 화면 헤더: 제목 없이 닫기 버튼, 아래로 그림자(shadow-2)를 드리운다
export default function OrderResultHeader({ onClose }: OrderResultHeaderProps) {
  return (
    <div className={styles.header}>
      <StoreMobileHeader title="" onBack={onClose} />
    </div>
  );
}
