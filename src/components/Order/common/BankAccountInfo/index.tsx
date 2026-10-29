import showMobileToast from 'components/feedback/Toast/showMobileToast';
import { copyToClipboard } from 'utils/ts/copyToClipboard';

import styles from './BankAccountInfo.module.scss';

const COPIED_MESSAGE = '계좌번호가 복사되었습니다.';
const EMPTY_VALUE = '-';

interface BankAccountInfoProps {
  bank: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
}

export default function BankAccountInfo({ bank, accountNumber, accountHolder }: BankAccountInfoProps) {
  const copyAccountNumber = async () => {
    if (!accountNumber) return;

    await copyToClipboard(accountNumber);
    showMobileToast('success', COPIED_MESSAGE);
  };

  const rows = [
    { label: '입금 은행', value: bank || EMPTY_VALUE },
    { label: '계좌번호', value: accountNumber || EMPTY_VALUE, canCopy: !!accountNumber },
    { label: '예금주', value: accountHolder || EMPTY_VALUE },
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
