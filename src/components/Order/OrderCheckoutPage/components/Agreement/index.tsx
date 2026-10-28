import RightArrow from 'assets/svg/Order/Cart/arrow-go-icon.svg';

import styles from './Agreement.module.scss';

// KOIN_ORDER_WEBVIEW pages/Payment/components/Agreement 이전. order도 약관 내용이 아직 없어 화살표 버튼은 동작하지 않는다
const AGREEMENT_GUIDES = [
  { title: '(주)BCSD 배달상품 주의사항 동의', content: '미정입니다' },
  { title: '개인정보 제3자 제공 동의', content: '미정입니다' },
  { title: '업주의 개인정보 처리 위탁 안내', content: '미정입니다' },
];

export default function Agreement() {
  return (
    <div className={styles.agreement}>
      {AGREEMENT_GUIDES.map((guide) => (
        <div className={styles.agreement__row} key={guide.title}>
          <div className={styles.agreement__title}>{guide.title}</div>
          <button type="button">
            <RightArrow />
          </button>
        </div>
      ))}
    </div>
  );
}
