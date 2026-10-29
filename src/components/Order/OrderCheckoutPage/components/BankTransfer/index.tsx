import { cn } from '@bcsdlab/utils';
import ArrowRightIcon from 'assets/svg/Order/Checkout/arrow-right.svg';
import CheckIcon from 'assets/svg/Order/Checkout/check.svg';
import BankAccountInfo from 'components/Order/common/BankAccountInfo';

import styles from './BankTransfer.module.scss';

// 결제 방법은 계좌이체 하나뿐이다. 입금 계좌는 결제하기 활성 조건에도 쓰여 화면(OrderCheckoutPage)이 조회해 넘긴다
const NOTICES = [
  '주문 후 30분 이내에 입금하지 않으면 주문이 자동 취소돼요.',
  '입금자명이 다르면 입금 확인이 늦어질 수 있어요.',
];

interface BankTransferProps {
  bank: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
  // 조회가 끝났는데 계좌가 없으면 계좌 대신 안내를 그린다
  isAccountUnavailable: boolean;
  // 계좌 조회가 실패하면 계좌 대신 다시 시도 버튼을 그린다
  isAccountError: boolean;
  onRetryAccount: () => void;
  isAgreed: boolean;
  onToggleAgreement: () => void;
}

export default function BankTransfer({
  bank,
  accountNumber,
  accountHolder,
  isAccountUnavailable,
  isAccountError,
  onRetryAccount,
  isAgreed,
  onToggleAgreement,
}: BankTransferProps) {
  let account = <BankAccountInfo bank={bank} accountNumber={accountNumber} accountHolder={accountHolder} />;
  if (isAccountError) {
    account = (
      <div className={styles.error}>
        <p>계좌 정보를 불러오지 못했어요</p>
        <button type="button" className={styles.error__retry} onClick={onRetryAccount}>
          다시 시도
        </button>
      </div>
    );
  } else if (isAccountUnavailable) {
    account = <p className={styles.unavailable}>계좌 정보가 등록되지 않은 가게예요</p>;
  }

  return (
    <div>
      <p className={styles.title}>결제 방법</p>
      <div className={styles.card}>
        <div className={styles.method}>계좌이체</div>

        {account}

        <ul className={styles.notice}>
          {NOTICES.map((notice) => (
            <li key={notice}>· {notice}</li>
          ))}
        </ul>

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
