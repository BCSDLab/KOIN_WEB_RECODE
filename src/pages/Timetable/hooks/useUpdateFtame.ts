// import { isKoinError, sendClientError } from '@bcsdlab/koin';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { updateFrame } from 'api/timetable';
// import { toast } from 'react-toastify';
// import useTokenState from 'utils/hooks/useTokenState';
// import { UpdateFrame } from 'api/timetable/entity';
// import { SEMESTER_INFO_KEY } from './useFrameList';

export default function useUpdate() {
  // const token = useTokenState();
  // const queryClient = useQueryClient();

  // const mutate = useMutation(
  //   {
  //     mutationFn: (frameInfo: UpdateFrame) => (updateFrame(token, frameInfo)),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: [SEMESTER_INFO_KEY] });
  //     },
  //     onError: (error) => {
  //       if (isKoinError(error)) {
  //         if (error.status === 401) toast('로그인을 해주세요');
  //         if (error.status === 403) toast('시간표 추가에 실패했습니다.');
  //         if (error.status === 404) toast('강의 정보를 찾을 수 없습니다.');
  //       } else {
  //         sendClientError(error);
  //         toast('시간표 추가에 실패했습니다.');
  //       }
  //     },
  //   },
  // );

  // return { mutate };
}
