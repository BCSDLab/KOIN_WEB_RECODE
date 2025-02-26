import React from 'react';
import { ListboxProps } from 'components/TimetablePage/Listbox';
import { Selector } from 'components/common/Selector';
import styles from './LectureList.module.scss';

type DecidedListboxProps = Omit<ListboxProps, 'list'>;

function DeptListbox({ value, onChange }: DecidedListboxProps) {
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

  React.useEffect(() => {
    if (deptOptionList.length !== 0) {
      onChange({ target: { value: deptOptionList[0].value } });
    }
    // onChange와 deptOptionList가 렌더링될 때마다 선언되서 처음 한번만 해야 하는 onChange를 렌더링할 때마다 한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.selector}>
      <Selector
        options={deptOptionList}
        value={value}
        isWhiteBackground={false}
        onChange={onChange}
        placeholder="전체"
      />
    </div>
  );
}

export default DeptListbox;
