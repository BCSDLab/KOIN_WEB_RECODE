import React, { Suspense } from 'react';
import { IDept } from 'api/dept/entity';
import { SemesterInfo, VersionInfo } from 'api/timetable/entity';
import Listbox, { ListboxProps } from 'components/TimetablePage/Listbox';
import LectureTable from 'components/TimetablePage/LectureTable';
import { LectureInfo, TimetableLectureInfo } from 'interfaces/Lecture';
import {
  myLectureAddLectureSelector,
  myLectureRemoveLectureSelector,
  myLecturesAtom,
  selectedSemesterAtom,
  selectedTempLectureSelector,
} from 'utils/recoil/semester';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import showToast from 'utils/ts/showToast';
import Timetable from 'components/TimetablePage/Timetable';
import ErrorBoundary from 'components/common/ErrorBoundary';
import useTimetableDayList from 'utils/hooks/useTimetableDayList';
import useTokenState from 'utils/hooks/useTokenState';
import LoadingSpinner from 'components/common/LoadingSpinner';
//
import useSemester from 'components/TimetablePage/hooks/useSemester';
import { useSelect, useSelectRecoil } from 'components/TimetablePage/hooks/useSelect';
import useLectureList from 'components/TimetablePage/hooks/useLectureList';
import useTimetableInfoList from 'components/TimetablePage/hooks/useTimetableInfoList';
import useAddTimetableLecture from 'components/TimetablePage/hooks/useAddTimetableLecture';
import useDeleteTimetableLecture from 'components/TimetablePage/hooks/useDeleteTimetableLecture';
import useVersionInfo from 'components/TimetablePage/hooks/useVersionInfo';
import useImageDownload from 'utils/hooks/useImageDownload';
//

import useDeptList from 'pages/Auth/SignupPage/hooks/useDeptList';
import styles from './DefaultPage.module.scss';

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
    setCurrentValue(e.currentTarget.value);
  };

  return {
    value: currentValue,
    onClickSearchButton,
    searchInputRef,
    onKeyDownSearchInput,
  };
};

const deptOptionList = [
  { label: '전체', value: '전체' },
  { label: '디자인ㆍ건축공학부', value: '디자인ㆍ건축공학부' },
  { label: '고용서비스정책학과', value: '고용서비스정책학과' },
  { label: '기계공학부', value: '기계공학부' },
  { label: '메카트로닉스공학부', value: '메카트로닉스공학부' },
  { label: '산업경영학부', value: '산업경영학부' },
  { label: '전기ㆍ전자ㆍ통신공학부', value: '전기ㆍ전자ㆍ통신공학부' },
  { label: '컴퓨터공학부', value: '컴퓨터공학부' },
  { label: '에너지신소재화학공학부', value: '에너지신소재화학공학부' },
  { label: '교양학부', value: '교양학부' }];

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
  React.useEffect(() => {
    if (deptOptionList.length !== 0) {
      onChange({ target: { value: deptOptionList[0].value } });
    }
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
  filter: {
    // 백엔드 수정하면 optional 제거
    department: string;
    search: string;
  }
}

function CurrentSemesterLectureList({
  semesterKey,
  filter,
}: CurrentSemesterLectureListProps) {
  const { data: lectureList } = useLectureList(semesterKey);
  const [selectedTempLecture, setSelectedTempLecture] = useRecoilState(selectedTempLectureSelector);
  const selectedSemester = useRecoilValue(selectedSemesterAtom);

  const myLecturesFromLocalStorageValue = useRecoilValue(myLecturesAtom);
  const addLectureToLocalStorage = useSetRecoilState(myLectureAddLectureSelector);

  const token = useTokenState();
  const { data: myLecturesFromServer } = useTimetableInfoList(selectedSemester, token);
  const { mutate: mutateAddWithServer } = useAddTimetableLecture(token);
  const isLoaded = (myLecturesFromLocalStorageValue !== null || myLecturesFromServer !== undefined);

  return (
    isLoaded ? (
      <LectureTable
        height={459}
        list={
          (lectureList as unknown as Array<LectureInfo>)
            .filter((lecture) => {
              const searchFilter = filter.search.toUpperCase();
              const departmentFilter = filter.department;

              if (searchFilter !== '' && departmentFilter !== '전체') {
                return lecture.name.toUpperCase().includes(searchFilter)
                  && lecture.department === departmentFilter;
              }
              if (searchFilter !== '') {
                return lecture.name.toUpperCase().includes(searchFilter);
              }
              if (departmentFilter !== '전체') {
                return lecture.department === departmentFilter;
              }

              return true;
            })
        }
        selectedLecture={selectedTempLecture ?? undefined}
        onClickRow={(clickedLecture) => ('name' in clickedLecture ? setSelectedTempLecture(clickedLecture) : undefined)}
        onClickLastColumn={
          (clickedLecture) => {
            if ('class_title' in clickedLecture) {
              return;
            }
            const myLecturesValue = token ? myLecturesFromServer : myLecturesFromLocalStorageValue;
            const myLectureTimeValue = (
              myLecturesValue as Array<LectureInfo | TimetableLectureInfo>)
              .reduce((acc, cur) => acc.concat(cur.class_time), [] as number[]);
            if (clickedLecture.class_time.some((time) => myLectureTimeValue.includes(time))) {
              showToast('error', '시간이 중복되어 추가할 수 없습니다.');
              return;
            }
            if (token) {
              mutateAddWithServer({
                semester: selectedSemester,
                timetable: [{ class_title: clickedLecture.name, ...clickedLecture }],
              });
            } else {
              addLectureToLocalStorage(clickedLecture);
            }
          }
        }
      >
        {(props: { onClick: () => void }) => (
          <button type="button" className={styles.list__button} onClick={props.onClick}>
            <img src="https://static.koreatech.in/assets/img/ic-add.png" alt="추가" />
          </button>
        )}
      </LectureTable>
    ) : (
      <LoadingSpinner size="80px" />
    //  <LoadingSpinner className={styles['top-loading-spinner']} />
    )
  );
}

function CurrentMyLectureList() {
  const myLecturesValue = useRecoilValue(myLecturesAtom);
  const removeLectureFromLocalStorage = useSetRecoilState(myLectureRemoveLectureSelector);

  const selectedSemester = useRecoilValue(selectedSemesterAtom);
  const token = useTokenState();
  const { data: myLecturesFromServer } = useTimetableInfoList(selectedSemester, token);
  const { mutate: removeLectureFromServer } = useDeleteTimetableLecture(selectedSemester, token);

  return (
    (myLecturesValue !== null || myLecturesFromServer !== undefined) ? (
      <LectureTable
        height={300}
        list={token ? (myLecturesFromServer ?? []) : (myLecturesValue ?? [])}
        selectedLecture={undefined}
        onClickRow={undefined}
        onClickLastColumn={
        (clickedLecture) => {
          if ('name' in clickedLecture) {
            removeLectureFromLocalStorage(clickedLecture);
            return;
          }
          removeLectureFromServer(clickedLecture.id.toString());
        }
      }
      >
        {(props: { onClick: () => void }) => (
          <button type="button" className={styles.list__button} onClick={props.onClick}>
            <img src="https://static.koreatech.in/assets/img/ic-delete.png" alt="제거" />
          </button>
        )}
      </LectureTable>
    ) : (
      <LoadingSpinner size="50px" />
    ));
}

function CurrentSemesterTimetable(): JSX.Element {
  const selectedSemesterValue = useRecoilValue(selectedSemesterAtom);
  const myLecturesFromLocalStorageValue = useRecoilValue(myLecturesAtom);

  const token = useTokenState();
  const selectedSemester = useRecoilValue(selectedSemesterAtom);
  const { data: myLecturesFromServer } = useTimetableInfoList(selectedSemester, token);
  const myLectureDayValue = useTimetableDayList(
    token
      ? (myLecturesFromServer ?? [])
      : (myLecturesFromLocalStorageValue ?? []),
  );

  const selectedLecture = useRecoilValue(selectedTempLectureSelector);
  const { data: lectureList } = useLectureList(selectedSemester);
  const similarSelectedLecture = (lectureList as unknown as Array<LectureInfo>)
    ?.filter((lecture) => lecture.code === selectedLecture?.code)
    ?? [];
  const similarSelectedLectureDayList = useTimetableDayList(similarSelectedLecture);
  const selectedLectureIndex = similarSelectedLecture
    .findIndex(({ lecture_class }) => lecture_class === selectedLecture?.lecture_class);

  return selectedSemesterValue ? (
    // 리코일 값이 어느 순간에 있는 것인지 확인하고 삼항 연산 빼는 방향으로 추가 수정 필요
    <Suspense fallback={<LoadingSpinner size="20px" />}>
      <Timetable
        lectures={myLectureDayValue}
        similarSelectedLecture={similarSelectedLectureDayList}
        selectedLectureIndex={selectedLectureIndex}
        columnWidth={55}
        firstColumnWidth={52}
        rowHeight={21}
        totalHeight={456}
      />
    </Suspense>
  ) : (
    <LoadingSpinner size="20px" />
  );
}

function Curriculum() {
  const { data: deptList } = useDeptList();

  return (
    <ul className={styles['page__curriculum-list']}>
      {(deptList as unknown as Array<IDept> | undefined ?? []).map((dept) => (
        <li key={dept.name}>
          <a
            className={styles.page__curriculum}
            href={dept.curriculum_link}
          >
            {dept.name}
          </a>
        </li>
      ))}
      <li>
        <a
          className={styles.page__curriculum}
          href="https://www.koreatech.ac.kr/board.es?mid=a10103010000&bid=0002"
        >
          대학 요람
        </a>
      </li>
    </ul>
  );
}

function RefactorDate(date: string) {
  return date.substring(0, 11).replaceAll('-', '. ').replace('T', '.');
}

function LastUpdatedDate() {
  const { data: updatedDate } = useVersionInfo();

  return (
    <div className={styles['page__last-update']}>
      <span className={styles['page__last-update--content']}>마지막 업데이트 날짜:</span>
      <span className={styles['page__last-update--info']}>{RefactorDate((updatedDate as unknown as VersionInfo).updated_at)}</span>
    </div>
  );
}

function DefaultPage() {
  const {
    searchInputRef,
    onClickSearchButton,
    onKeyDownSearchInput,
    value: searchValue,
  } = useSearch();
  const {
    value: departmentFilterValue,
    onChangeSelect: onChangeDeptSelect,
  } = useSelect();
  const {
    value: semesterFilterValue,
    onChangeSelect: onChangeSemesterSelect,
  } = useSelectRecoil(selectedSemesterAtom);
  const { onImageDownload: onTimetableImageDownload } = useImageDownload();
  // divRef: timetableRef  사용안하고 있다는데 dev 코드 비교 필요
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
              <React.Suspense fallback={<LoadingSpinner size="20px" />}>
                <DeptListbox
                  value={departmentFilterValue}
                  onChange={onChangeDeptSelect}
                />
              </React.Suspense>
            </div>
          </div>

          <ErrorBoundary fallbackClassName="loading">
            <React.Suspense fallback={<LoadingSpinner size="30px" />}>
              <CurrentSemesterLectureList
                semesterKey={semesterFilterValue}
                filter={{
                  // 백엔드 수정하면 제거
                  department: departmentFilterValue ?? '전체',
                  search: searchValue ?? '',
                }}
              />
            </React.Suspense>
          </ErrorBoundary>
          <ErrorBoundary fallbackClassName="loading">
            <React.Suspense fallback={<LoadingSpinner size="20px" />}>
              <LastUpdatedDate />
            </React.Suspense>
          </ErrorBoundary>
        </div>
        <div className={styles['page__timetable-wrap']}>
          <div className={styles.page__filter}>
            <div className={styles.page__semester}>
              <Suspense fallback={<LoadingSpinner size="20px" />}>
                <SemesterListbox
                  value={semesterFilterValue}
                  onChange={onChangeSemesterSelect}
                />
              </Suspense>
            </div>
            <button
              type="button"
              className={styles.page__button}
              onClick={() => onTimetableImageDownload('my-timetable')}
            >
              <img src="https://static.koreatech.in/assets/img/ic-image.png" alt="이미지" />
              이미지로 저장하기
            </button>
          </div>
          <div className={styles.page__timetable}>
            <ErrorBoundary fallbackClassName="CurrentSemesterTimetable ErrorBoundary loading">
              <React.Suspense fallback={<LoadingSpinner size="30px" />}>
                <CurrentSemesterTimetable />
              </React.Suspense>
            </ErrorBoundary>
          </div>
        </div>

        <div>
          <h3 className={styles['page__title--sub']}>나의 시간표</h3>
          <div className={styles['page__table--selected']}>
            {/* <ErrorBoundary fallbackClassName="loading">
              <React.Suspense fallback={<LoadingSpinner size="20px"  />}> */}
            <ErrorBoundary fallbackClassName="CurrentMyLectureList ErrorBoundary loading">
              <React.Suspense fallback={<LoadingSpinner size="30px" />}>
                <CurrentMyLectureList />
              </React.Suspense>
            </ErrorBoundary>
          </div>
        </div>
        <div>
          <h3 className={styles['page__title--sub']}>커리큘럼</h3>
          <ErrorBoundary fallbackClassName="loading">
            <React.Suspense fallback={<LoadingSpinner size="30px" />}>
              <Curriculum />
            </React.Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
}

export { DefaultPage, useSemesterOptionList };
