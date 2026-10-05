import PenIcon from 'assets/svg/timetable-square-pen-icon.svg';
import showTimetableToast from 'components/feedback/Toast/showTimetableToast';
import HeaderIconButton from 'components/ui/PageHeader/HeaderIconButton';

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
