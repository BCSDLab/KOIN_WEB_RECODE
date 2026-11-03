import type { BankAccount } from 'api/order/entity';
import showMobileToast from 'components/feedback/Toast/showMobileToast';
import { copyToClipboard } from 'utils/ts/copyToClipboard';

import styles from './BankAccountInfo.module.scss';

const COPIED_MESSAGE = '계좌번호가 복사되었습니다.';

interface BankAccountInfoProps {
  account: BankAccount;
}

export default function BankAccountInfo({ account }: BankAccountInfoProps) {
  const copyAccountNumber = async () => {
    await copyToClipboard(account.account_number);
    showMobileToast('success', COPIED_MESSAGE);
  };

  const rows = [
    { label: '입금 은행', value: account.bank },
    { label: '계좌번호', value: account.account_number, canCopy: true },
    { label: '예금주', value: account.account_holder },
  ];

  return (
    <div className={styles.account}>
      <p className={styles.account__title}>아래 계좌로 입금해주세요</p>
      {rows.map(({ label, value, canCopy }) => (
        <div className={styles.account__row} key={label}>
          <span className={styles.account__label}>{label}</span>
          <span className={styles.account__value}>{value}</span>
          {canCopy && (
            <button type="button" className={styles.account__copy} onClick={copyAccountNumber}>
              복사
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
