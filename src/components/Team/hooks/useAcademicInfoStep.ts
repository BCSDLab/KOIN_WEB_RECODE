import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getUserAcademicInfo, updateAcademicInfo } from 'api/auth';
import { deptQueries } from 'api/dept/queries';
import { useFormContext } from 'react-hook-form';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

interface AcademicInfoFormValues {
  nickname: string;
  department: string;
  studentNumber: string;
}

interface AcademicInfoLoggingTitle {
  LOAD_USER_INFO: string;
  MAJOR_SELECT: string;
  NEXT: string;
}

export default function useAcademicInfoStep(loggingTitle: AcademicInfoLoggingTitle, onSaved: () => void) {
  const token = useTokenState();
  const { actionEventClick } = useLogger();
  const { setValue } = useFormContext<AcademicInfoFormValues>();

  const { data: deptList } = useSuspenseQuery(deptQueries.list());
  const deptOptionList = deptList.map((dept) => ({ label: dept.name, value: dept.name }));

  const { mutate: loadUserInfo, isPending: isLoadingUserInfo } = useMutation({
    mutationFn: () => getUserAcademicInfo(token),
    onSuccess: (data) => {
      setValue('nickname', data.nickname ?? '', { shouldValidate: true });
      setValue('studentNumber', data.student_number ?? '', { shouldValidate: true });

      const isKnownDept = deptOptionList.some((option) => option.value === data.department);
      if (isKnownDept) {
        setValue('department', data.department, { shouldValidate: true });
      }

      showToast('success', '회원정보를 불러왔습니다.');
    },
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '회원정보를 불러오지 못했습니다.');
        return;
      }
      showToast('error', '회원정보를 불러오지 못했습니다.');
      sendClientError(error);
    },
  });

  const handleLoadUserInfo = () => {
    actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: loggingTitle.LOAD_USER_INFO,
      value: '회원정보 불러오기',
    });

    if (!token) {
      showToast('warning', '로그인 후 이용해주세요.');
      return;
    }
    loadUserInfo();
  };

  const { mutate: saveAcademicInfo, isPending: isSaving } = useMutation({
    mutationFn: (data: { department: string; studentNumber: string }) =>
      updateAcademicInfo(token, { department: data.department, student_number: data.studentNumber }),
    onSuccess: () => {
      actionEventClick({ team: 'CAMPUS', event_category: 'click', event_label: loggingTitle.NEXT, value: '다음' });
      onSaved();
    },
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '학적 정보 수정에 실패했습니다.');
        return;
      }
      showToast('error', '학적 정보 수정에 실패했습니다.');
      sendClientError(error);
    },
  });

  const handleSaveAcademicInfo = (data: { department: string; studentNumber: string }) => {
    if (!token) {
      showToast('warning', '로그인 후 이용해주세요.');
      return;
    }
    saveAcademicInfo(data);
  };

  const handleMajorSelect = (value: string) => {
    actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: loggingTitle.MAJOR_SELECT,
      value,
    });
  };

  return {
    deptOptionList,
    isLoadingUserInfo,
    isSaving,
    handleLoadUserInfo,
    handleSaveAcademicInfo,
    handleMajorSelect,
  };
}
