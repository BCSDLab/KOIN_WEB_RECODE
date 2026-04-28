import { isKoinError } from '@bcsdlab/koin';
import { CallvanRestrictionResponse } from 'api/callvan/entity';

const CALLVAN_RESTRICTED_ERROR_STATUS = 403;

interface CallvanRestrictionModalCopy {
  titleAccent: string;
  titleRest: string;
  descriptionLines: string[];
}

const restrictionDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Seoul',
});

export function isCallvanRestrictedError(error: unknown): boolean {
  if (!isKoinError(error)) return false;

  return error.status === CALLVAN_RESTRICTED_ERROR_STATUS;
}

function formatRestrictedUntil(restrictedUntil: string | null): string | null {
  if (!restrictedUntil) return null;

  const date = new Date(restrictedUntil);
  if (Number.isNaN(date.getTime())) return null;

  return `${restrictionDateFormatter.format(date)}까지`;
}

export function getCallvanRestrictionModalCopy(
  restriction: CallvanRestrictionResponse | null,
): CallvanRestrictionModalCopy {
  if (restriction?.restriction_type === 'TEMPORARY_RESTRICTION_14_DAYS') {
    const formattedDate = formatRestrictedUntil(restriction.restricted_until);

    return {
      titleAccent: '14일',
      titleRest: ' 이용 정지',
      descriptionLines: formattedDate
        ? [`해당 계정은 ${formattedDate}`, '콜밴팟 기능을 사용할 수 없습니다.']
        : ['해당 계정은 콜밴팟 기능을', '사용할 수 없습니다.'],
    };
  }

  if (restriction?.restriction_type === 'PERMANENT_RESTRICTION') {
    return {
      titleAccent: '영구',
      titleRest: ' 정지',
      descriptionLines: ['해당 계정은 콜밴팟 기능을', '사용할 수 없습니다.'],
    };
  }

  return {
    titleAccent: '이용',
    titleRest: ' 제한',
    descriptionLines: ['해당 계정은 콜밴팟 기능을', '사용할 수 없습니다.'],
  };
}
