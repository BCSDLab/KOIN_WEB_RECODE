import React from 'react';
import { auth } from 'api';
import showToast from 'utils/ts/showToast';
import { useMutation } from '@tanstack/react-query';
import styles from './FindPasswordPage.module.scss';

interface IClassUser {
  userId: HTMLInputElement | null
}

const emailLocalPartRegex = /^[a-z_0-9]{1,12}$/;

const useFindPassword = () => {
  const postFindPassword = useMutation({
    mutationFn: auth.findPassword,
    onSuccess: () => {
      showToast('success', '비밀번호 초기화 메일을 전송했습니다. 아우누리에서 확인해주세요.');
    },
  });

  const findPassword = async (userId: string) => {
    if (userId === null) {
      showToast('error', '계정을 입력해주세요');
      return;
    }
    if (userId.indexOf('@koreatech.ac.kr') !== -1) {
      showToast('error', '계정명은 @koreatech.ac.kr을 빼고 입력해주세요.'); // 모든 alert는 Toast로 교체 예정
      return;
    }
    if (!emailLocalPartRegex.test(userId)) {
      showToast('error', '아우누리 계정 형식이 아닙니다.');
      return;
    }

    postFindPassword.mutate({
      email: `${userId}@koreatech.ac.kr`,
    });
  };
  return findPassword;
};

function FindPasswordPage() {
  const FindIdRef = React.useRef<IClassUser>({
    userId: null,
  });
  const submitFindPassword = useFindPassword();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { userId } = FindIdRef.current;
    submitFindPassword(userId!.value);
  };

  return (
    <div className={styles.template}>
      <form className={styles.findpasswordform} onSubmit={onSubmit}>
        <input
          ref={(inputRef) => { FindIdRef.current.userId = inputRef; }}
          className={styles['form-input']}
          autoComplete="username"
          name="userId"
          placeholder="아우누리 아이디를 입력하세요"
        />
        <button type="submit" className={styles.findpasswordform__button}>
          비밀번호 찾기
        </button>
      </form>
      <span className={styles.findpasswordform__advice}>학교메일로 비밀번호 초기화 메일이 발송됩니다.</span>
      <span className={styles.template__copyright}>
        COPYRIGHT ⓒ&nbsp;
        {
            new Date().getFullYear()
          }
          &nbsp;BY BCSDLab ALL RIGHTS RESERVED.
      </span>
    </div>
  );
}

export default FindPasswordPage;
