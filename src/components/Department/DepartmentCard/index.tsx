import { DepartmentContactDepartment } from 'api/departmentContact/entity';
import ClipboardCopyIcon from 'assets/svg/department/clipboard-copy-icon.svg';
import useLogger from 'utils/hooks/analytics/useLogger';
import showToast from 'utils/ts/showToast';
import styles from './DepartmentCard.module.scss';

interface DepartmentCardProps {
  department: DepartmentContactDepartment;
}

export default function DepartmentCard({ department }: DepartmentCardProps) {
  const logger = useLogger();

  const copyPhoneNumber = async (phoneNumber: string) => {
    await navigator.clipboard.writeText(phoneNumber);
    showToast('info', '전화번호가 복사되었습니다.');
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'department_contact_copy',
      value: department.name,
    });
  };

  if (!department.is_single_contact) {
    return (
      <div className={styles.card}>
        <h2 className={styles.card__title}>{department.name}</h2>
        <div className={styles.table}>
          <div className={`${styles.table__row} ${styles['table__row--head']}`}>
            <span className={styles.table__task}>업무</span>
            <span className={styles.table__phone}>전화번호</span>
          </div>
          {department.contacts.map((contact) => (
            <div key={`${contact.task}-${contact.phone_number}`} className={styles.table__row}>
              <span className={styles.table__task}>{contact.task}</span>
              <span className={styles.table__phone}>{contact.phone_number}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const [contact] = department.contacts;

  return (
    <div className={styles.card}>
      <h2 className={styles.card__title}>{department.name}</h2>
      <div className={styles.single}>
        <span className={styles.single__phone}>
          전화번호 :
          {' '}
          {contact?.phone_number}
        </span>
        {contact && (
          <button
            type="button"
            className={styles.single__copy}
            onClick={() => copyPhoneNumber(contact.phone_number)}
          >
            전화번호 복사
            <ClipboardCopyIcon aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
