import { cn } from '@bcsdlab/utils';
import ArrowRightIcon from 'assets/svg/Order/Checkout/arrow-right.svg';
import CheckIcon from 'assets/svg/Order/Checkout/check.svg';

import styles from './BankTransfer.module.scss';

// 결제 방법은 계좌이체 하나뿐이다. 입금 계좌는 주문이 만들어진 뒤 결과 화면에서 보여준다
interface BankTransferProps {
  isAgreed: boolean;
  onToggleAgreement: () => void;
}

export default function BankTransfer({ isAgreed, onToggleAgreement }: BankTransferProps) {
  return (
    <div>
      <p className={styles.title}>결제 방법</p>
      <div className={styles.card}>
        <div className={styles.method}>계좌이체</div>
        <p className={styles.guide}>주문을 완료하면 입금할 계좌를 알려드려요.</p>

        <div className={styles.consent}>
          <button
            type="button"
            role="checkbox"
            aria-checked={isAgreed}
            className={styles.consent__toggle}
            onClick={onToggleAgreement}
          >
            <CheckIcon className={cn({ [styles.consent__check]: true, [styles['consent__check--off']]: !isAgreed })} />
            [필수] 결제 서비스 이용 약관, 개인정보 처리 동의
          </button>
          {/* 약관 본문이 아직 없어 아래 동의 목록(Agreement)처럼 화살표는 동작하지 않는다 */}
          <button type="button" aria-label="결제 서비스 이용 약관 보기">
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
