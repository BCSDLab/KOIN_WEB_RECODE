import React from 'react';
import { IDept } from 'api/dept/entity';
import { SemesterInfo } from 'api/timetable/entity';
import Listbox, { ListboxProps } from 'components/TimetablePage/Listbox';
import LectureTable from 'components/TimetablePage/LectureTable';
import { LectureInfo } from 'interfaces/Lecture';
import useDeptList from './hooks/useDeptList';
import styles from './DefaultPage.module.scss';
import useSemester from './hooks/useSemester';
import useSelect from './hooks/useSelect';
import useLectureList from './hooks/useLectureList';

const useSearch = () => {
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [currentValue, setCurrentValue] = React.useState<string | null>(null);
  const onClickSearchButton = () => {
    setCurrentValue(searchInputRef.current?.value ?? '');
  };
  const onKeyDownSearchInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }
    const { target } = e;
    setCurrentValue(target.value);
  };

  return {
    value: currentValue,
    onClickSearchButton,
    searchInputRef,
    onKeyDownSearchInput,
  };
};

const defaultOptionList = [
  { label: '전체', value: '전체' },
];

const useDeptOptionList = () => {
  const { data: deptList } = useDeptList();
  // 구조가 Array<Dept>인데 Array로 인식이 안됨.
  const deptOptionList = defaultOptionList.concat(
    (deptList as unknown as Array<IDept> | undefined ?? []).map(
      (dept) => ({ label: dept.name, value: dept.name }),
    ) ?? [],
  );

  return deptOptionList;
};
const useSemesterOptionList = () => {
  const { data: semesterList } = useSemester();
  // 구조가 Array<SemesterInfo>인데 Array로 인식이 안됨.
  const semesterOptionList = (semesterList as unknown as Array<SemesterInfo> | undefined ?? []).map(
    (semesterInfo) => ({
      label: `${semesterInfo.semester.slice(0, 4)}년 ${semesterInfo.semester.slice(4)}학기`,
      value: semesterInfo.semester,
    }),
  );

  return semesterOptionList;
};

type DecidedListboxProps = Omit<ListboxProps, 'list'>;

function DeptListbox({ value, onChange }: DecidedListboxProps) {
  const deptOptionList = useDeptOptionList();
  React.useEffect(() => {
    onChange({ target: { value: deptOptionList[0].value } });
  // onChange와 deptOptionList가 렌더링될 때마다 선언되서 처음 한번만 해야 하는 onChange를 렌더링할 때마다 한다.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Listbox list={deptOptionList} value={value} onChange={onChange} />
  );
}

function SemesterListbox({ value, onChange }: DecidedListboxProps) {
  const semesterOptionList = useSemesterOptionList();
  React.useEffect(() => {
    onChange({ target: { value: semesterOptionList[0].value } });
  // onChange와 deptOptionList가 렌더링될 때마다 선언되서 처음 한번만 해야 하는 onChange를 렌더링할 때마다 한다.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Listbox list={semesterOptionList} value={value} onChange={onChange} />
  );
}

interface CurrentSemesterLectureListProps {
  semesterKey: string | null;
}

function CurrentSemesterLectureList({ semesterKey }: CurrentSemesterLectureListProps) {
  const { data: lectureList, status } = useLectureList(semesterKey);
  return (
    status === 'success' ? (
      <LectureTable list={lectureList as unknown as Array<LectureInfo>} />
    ) : (
      <div>
        Loading...
      </div>
    )
  );
}

function DefaultPage() {
  const {
    searchInputRef,
    onClickSearchButton,
    onKeyDownSearchInput,
    // value: searchValue,
  } = useSearch();
  const {
    value: deptFilterValue,
    onChangeSelect: onChangeDeptSelect,
  } = useSelect();
  const {
    value: semesterFilterValue,
    onChangeSelect: onChangeSemesterSelect,
  } = useSelect();

  return (
    <>
      <h1 className={styles.page__title}>시간표</h1>
      <div className={styles.page__content}>
        <div>
          <div className={styles.page__filter}>
            <div className={styles['search-input']}>
              <input
                ref={searchInputRef}
                className={styles['search-input__input']}
                placeholder="교과명을 입력하세요."
                onKeyDown={onKeyDownSearchInput}
              />
              <button
                className={styles['search-input__button']}
                type="button"
                onClick={onClickSearchButton}
              >
                <img src="https://static.koreatech.in/assets/img/ic-search-gray.png" alt="search" />
              </button>
            </div>
            <div className={styles.page__depart}>
              <React.Suspense fallback="loading...">
                <DeptListbox
                  value={deptFilterValue}
                  onChange={onChangeDeptSelect}
                />
              </React.Suspense>
            </div>
          </div>
          <React.Suspense fallback="loading...">
            <CurrentSemesterLectureList semesterKey={semesterFilterValue} />
          </React.Suspense>
        </div>
        <div>
          <div className={styles.page__filter}>

            <div className={styles.page__semester}>
              <React.Suspense fallback="loading...">
                <SemesterListbox
                  value={semesterFilterValue}
                  onChange={onChangeSemesterSelect}
                />
              </React.Suspense>
            </div>
            <button type="button" className={styles.page__button}>
              <img src="https://static.koreatech.in/assets/img/ic-image.png" alt="이미지" />
              이미지로 저장하기
            </button>
          </div>
        </div>
        <div>내 강의</div>
        <div>커리큘럼</div>
      </div>
    </>
  );
}

export default DefaultPage;
