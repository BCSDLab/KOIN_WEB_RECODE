import PenIcon from 'assets/svg/timetable-square-pen-icon.svg';
import showTimetableToast from 'components/feedback/Toast/showTimetableToast';
import type { Portal } from 'components/modal/Modal/PortalProvider';
import useSemesterCheck from 'components/TimetablePage/hooks/useMySemester';
import useRequireLogin from 'components/TimetablePage/hooks/useRequireLogin';
import SemesterEditModal from 'components/TimetablePage/MobileTimetableListPage/SemesterEditModal';
import HeaderIconButton from 'components/ui/PageHeader/HeaderIconButton';
import useModalPortal from 'utils/hooks/layout/useModalPortal';

export function TimetableEditButton() {
  return (
    <HeaderIconButton
      aria-label="시간표 수정"
      onClick={() => showTimetableToast('info', 'PC환경만 지원합니다. PC를 이용해주세요.')}
    >
      <PenIcon />
    </HeaderIconButton>
  );
}

export function SemesterEditButton() {
  const portalManager = useModalPortal();
  const requireLogin = useRequireLogin();
  const { data: mySemester } = useSemesterCheck();

  const handleClick = () => {
    if (!mySemester) {
      requireLogin('학기 편집');

      return;
    }
    portalManager.open((portalOption: Portal) => <SemesterEditModal onClose={portalOption.close} />);
  };

  return (
    <HeaderIconButton aria-label="학기 편집" onClick={handleClick}>
      <PenIcon />
    </HeaderIconButton>
  );
}
