import { Course, PreCourse } from 'api/course/entity';
import styles from './CourseTable.module.scss';

type TableVariant = 'open' | 'pre' | 'selected';

interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (item: T, index: number) => React.ReactNode;
}

interface CourseTableProps<T> {
  variant: TableVariant;
  title: string;
  data: T[];
  columns: Column<T>[];
  getRowKey: (item: T, index: number) => string;
  headerExtra?: React.ReactNode;
}

export default function CourseTable<T>({ variant, title, data, columns, getRowKey, headerExtra }: CourseTableProps<T>) {
  const sizeClass = variant === 'open' ? styles['table--full'] : styles['table--half'];
  const variantClass = styles[`table--${variant}`];

  return (
    <div className={`${styles.table} ${sizeClass} ${variantClass}`}>
      <div className={styles.table__header}>
        <h3 className={styles.table__title}>
          {title}
          <span className={styles.table__count}>{`${data.length}건`}</span>
        </h3>
        {headerExtra}
      </div>
      <div className={styles.table__container}>
        <table className={styles.table__grid}>
          <thead className={styles.table__head}>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={styles.table__th}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div className={styles['table__body-wrapper']}>
          <table className={styles['table__body-table']}>
            <tbody>
              {data.map((item, index) => (
                <tr key={getRowKey(item, index)} className={styles.table__row}>
                  {columns.map((col) => (
                    <td key={col.key} className={`${styles.table__td} ${col.className || ''}`}>
                      {col.render(item, index)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  type: 'apply' | 'cancel';
  onClick: () => void;
}

function ActionButton({ type, onClick }: ActionButtonProps) {
  const label = type === 'apply' ? '신청' : '취소';
  return (
    <button type="button" className={styles[`button--${type}`]} onClick={onClick}>
      {label}
    </button>
  );
}

const col = {
  no: <T,>(): Column<T> => ({
    key: 'no',
    header: 'No.',
    render: (_, index) => index + 1,
  }),
  grades: <T extends { grades: string }>(): Column<T> => ({
    key: 'grades',
    header: '학-강-실-설',
    render: (item) => item.grades,
  }),
  lectureName: <T extends { lecture_info?: { lecture_name: string } | null }>(): Column<T> => ({
    key: 'name',
    header: '교과목명',
    className: styles['table__text-left'],
    render: (item) => item.lecture_info?.lecture_name ?? '사용자 지정',
  }),
  section: <T extends { class_number?: string | null }>(): Column<T> => ({
    key: 'section',
    header: '분반',
    render: (item) => item.class_number ?? '-',
  }),
};

export function createOpenCoursesColumns(onAddCourse: (course: PreCourse) => void): Column<Course>[] {
  return [
    col.no(),
    {
      key: 'action',
      header: '신청',
      render: (course) => (
        <ActionButton
          type="apply"
          onClick={() =>
            onAddCourse({
              department: course.department,
              lecture_info: course.lecture_info,
              class_number: course.class_number,
              grades: course.grades,
              class_time_raw: course.class_time_raw,
            })
          }
        />
      ),
    },
    { key: 'code', header: '강의코드', render: (course) => course.lecture_info.lecture_code },
    {
      key: 'name',
      header: '교과목명',
      className: styles['table__text-left'],
      render: (course) => course.lecture_info.lecture_name,
    },
    col.section(),
    { key: 'professor', header: '담당교수', render: (course) => course.professor },
    col.grades(),
    {
      key: 'time',
      header: '수업교시',
      className: styles['table__text-left'],
      render: (course) => course.class_time,
    },
    { key: 'capacity', header: '수강정원', render: (course) => course.regular_number },
    { key: 'enrolled', header: '신청인원', render: () => '-' },
  ];
}

export function createPreCoursesColumns(onAddCourse: (course: PreCourse) => void): Column<PreCourse>[] {
  return [
    col.no(),
    {
      key: 'action',
      header: '신청',
      render: (course) => <ActionButton type="apply" onClick={() => onAddCourse(course)} />,
    },
    { key: 'code', header: '강의코드', render: (course) => course.lecture_info?.lecture_code ?? '-' },
    col.lectureName(),
    col.section(),
    col.grades(),
  ];
}

export function createSelectedCoursesColumns(onRemoveCourse: (index: number) => void): Column<PreCourse>[] {
  return [
    col.no(),
    {
      key: 'action',
      header: '취소',
      render: (_, index) => <ActionButton type="cancel" onClick={() => onRemoveCourse(index)} />,
    },
    { key: 'department', header: '이수구분', render: (course) => course.department ?? '-' },
    col.lectureName(),
    col.section(),
    { key: 'retake', header: '재이수', render: () => '-' },
    col.grades(),
  ];
}

interface CreditDisplayProps {
  credits: number;
}

export function CreditDisplay({ credits }: CreditDisplayProps) {
  return (
    <div className={styles.table__credit}>
      <label htmlFor="total-credits" className={styles['table__credit-label']}>
        신청학점
      </label>
      <input id="total-credits" className={styles['table__credit-input']} type="text" value={credits} disabled />
    </div>
  );
}
