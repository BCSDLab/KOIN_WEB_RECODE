import SemesterList from 'pages/TimetablePage/components/SemesterList';
import SemesterCourseTable from 'pages/GraduationCalculatorPage/components/CourseTable/SemesterCourseTable';
import Listbox from 'components/TimetablePage/Listbox';
import DeptListbox from 'pages/TimetablePage/components/LectureList/DeptListbox';
import useSelect from 'pages/TimetablePage/hooks/useSelect';
import styles from './SemesterLectureList.module.scss';

const lectureTaken = [
  { label: '수강한 강의', value: '수강한 강의' },
  { label: '미수강 강의', value: '미수강 강의' },
];

const courseType = [
  { label: '교양필수', value: '교양필수' },
  { label: '교양선택', value: '교양선택' },
  { label: '전공필수', value: '전공필수' },
  { label: '전공선택', value: '전공선택' },
  { label: 'MSC필수', value: 'MSC필수' },
  { label: 'MSC선택', value: 'MSC선택' },
  { label: 'HRD필수', value: 'HRD필수' },
  { label: 'HRD선택', value: 'HRD선택' },
  { label: '자유선택', value: '자유선택' },
  { label: '다전공', value: '다전공' },
];

export default function SemesterLectureListModal({ onClose }: { onClose: () => void }) {
  const {
    value: departmentFilterValue,
    onChangeSelect: onChangeDeptSelect,
  } = useSelect();

  const {
    value: takenLectureValue,
    onChangeSelect: onChangeIsTakenSelect,
  } = useSelect();

  const {
    value: courseTypeValue,
    onChangeSelect: onChangeCourseType,
  } = useSelect();

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.container__header}>
          <div>학기 강의 개설 목록</div>
          <button type="button" onClick={onClose}>닫기</button>
        </div>
        <div className={styles.container__dropdowns}>
          <SemesterList />
          <Listbox list={lectureTaken} value={takenLectureValue} onChange={onChangeIsTakenSelect} />
          <DeptListbox value={departmentFilterValue} onChange={onChangeDeptSelect} />
          <Listbox list={courseType} value={courseTypeValue} onChange={onChangeCourseType} />
        </div>
        <SemesterCourseTable frameId={11111} />
      </div>
    </div>
  );
}
