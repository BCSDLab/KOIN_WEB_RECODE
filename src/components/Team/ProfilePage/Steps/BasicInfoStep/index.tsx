import { isKoinError } from '@bcsdlab/koin';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getUserAcademicInfo, updateAcademicInfo } from 'api/auth';
import { deptQueries } from 'api/dept/queries';
import DeptSelect from 'components/Team/ProfilePage/components/DeptSelect';
import FormField from 'components/Team/ProfilePage/components/FormField';
import StepIndicator from 'components/Team/ProfilePage/components/StepIndicator';
import { PROFILE_STEPS, type ProfileFormValues } from 'components/Team/ProfilePage/types';
import { Controller, useFormContext, useFormState, useWatch } from 'react-hook-form';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import styles from './BasicInfoStep.module.scss';

interface BasicInfoStepProps {
  onNext: () => void;
}

const loggingTitle = {
  LOAD_USER_INFO: 'team_profile_load_user_info',
  NEXT: 'team_profile_basic_info_next',
};

export default function BasicInfoStep({ onNext }: BasicInfoStepProps) {
  const { actionEventClick } = useLogger();
  const token = useTokenState();
  const { control, register, setValue, trigger, getValues } = useFormContext<ProfileFormValues>();
  const { errors } = useFormState({ control });

  const nickname = useWatch({ control, name: 'nickname' }) ?? '';

  const { data: deptList } = useSuspenseQuery(deptQueries.list());
  const deptOptionList = deptList.map((dept) => ({ label: dept.name, value: dept.name }));

  const { mutate: loadUserInfo, isPending } = useMutation({
    mutationFn: () => getUserAcademicInfo(token),
    onSuccess: (data) => {
      setValue('nickname', data.nickname ?? '', { shouldValidate: true });
      setValue('studentNumber', data.student_number ?? '', { shouldValidate: true });

      // 학과 select의 옵션과 정확히 일치할 때만 채운다. 일치하지 않으면 값만 세팅되고 화면엔 placeholder가 남아 혼란스럽다.
      const isKnownDept = deptOptionList.some((option) => option.value === data.department);
      if (isKnownDept) {
        setValue('department', data.department, { shouldValidate: true });
      }

      showToast('success', '회원정보를 불러왔습니다.');
    },
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '회원정보를 불러오지 못했습니다.');
      } else {
        showToast('error', '회원정보를 불러오지 못했습니다.');
      }
    },
  });

  const handleLoadUserInfo = () => {
    // TODO: 팀원모집 도메인 로깅 team 값 컨벤션 확인 필요
    actionEventClick({ team: 'TEAM', event_category: 'click', event_label: loggingTitle.LOAD_USER_INFO, value: '' });

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
      // TODO: 팀원모집 도메인 로깅 team 값 컨벤션 확인 필요
      actionEventClick({ team: 'TEAM', event_category: 'click', event_label: loggingTitle.NEXT, value: '다음' });
      onNext();
    },
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '학적 정보 수정에 실패했습니다.');
      } else {
        showToast('error', '학적 정보 수정에 실패했습니다.');
      }
    },
  });

  const handleNext = async () => {
    const isValid = await trigger(['nickname', 'department', 'studentNumber']);
    if (!isValid) return;

    if (!token) {
      showToast('warning', '로그인 후 이용해주세요.');
      return;
    }

    const { department, studentNumber } = getValues();
    saveAcademicInfo({ department, studentNumber });
  };

  return (
    <div className={styles.step}>
      <StepIndicator steps={PROFILE_STEPS} currentIndex={0} />

      <div className={styles.step__body}>
        <div className={styles.loadInfo}>
          <div className={styles.loadInfo__head}>
            <span className={styles.loadInfo__title}>
              <span className={styles['loadInfo__title--highlight']}>코인</span> 회원정보 불러오기
            </span>
            <span className={styles.loadInfo__description}>닉네임, 학과(학부), 학번</span>
          </div>
          <button type="button" className={styles.loadInfo__button} onClick={handleLoadUserInfo} disabled={isPending}>
            회원정보 불러오기
          </button>
        </div>

        <FormField
          label="닉네임"
          required
          maxLength={20}
          currentLength={nickname.length}
          error={errors.nickname?.message}
        >
          {({ controlId, controlClassName, ariaDescribedBy, ariaInvalid }) => (
            <input
              id={controlId}
              type="text"
              className={controlClassName}
              placeholder="닉네임을 입력해주세요."
              maxLength={20}
              aria-describedby={ariaDescribedBy}
              aria-invalid={ariaInvalid}
              {...register('nickname', {
                required: '닉네임을 입력해주세요.',
                maxLength: { value: 20, message: '닉네임은 20자 이내로 입력해주세요.' },
              })}
            />
          )}
        </FormField>

        <FormField label="학과 · 학부" required error={errors.department?.message}>
          {({ controlId, ariaDescribedBy }) => (
            <Controller
              control={control}
              name="department"
              rules={{ required: '학과 · 학부를 선택해주세요.' }}
              render={({ field }) => (
                <DeptSelect
                  id={controlId}
                  options={deptOptionList}
                  value={field.value || null}
                  placeholder="학과 · 학부를 선택해주세요."
                  onChange={(event) => field.onChange(event.target.value)}
                  disabled={isSaving}
                  ariaDescribedBy={ariaDescribedBy}
                />
              )}
            />
          )}
        </FormField>

        <FormField label="학번" required error={errors.studentNumber?.message}>
          {({ controlId, controlClassName, ariaDescribedBy, ariaInvalid }) => (
            <input
              id={controlId}
              type="text"
              inputMode="numeric"
              className={controlClassName}
              placeholder="학번을 작성해주세요."
              maxLength={10}
              disabled={isSaving}
              aria-describedby={ariaDescribedBy}
              aria-invalid={ariaInvalid}
              {...register('studentNumber', { required: '학번을 작성해주세요.' })}
            />
          )}
        </FormField>
      </div>

      <div className={styles.step__footer}>
        <button type="button" className={styles.step__submit} onClick={handleNext} disabled={isSaving}>
          다음
        </button>
      </div>
    </div>
  );
}
