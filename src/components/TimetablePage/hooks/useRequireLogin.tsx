import type { Portal } from 'components/modal/Modal/PortalProvider';
import InducingLoginModal from 'components/TimetablePage/components/InducingLoginModal';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import { getTopicParticle } from 'utils/ts/josa';

export default function useRequireLogin() {
  const portalManager = useModalPortal();

  return (actionTitle: string) => {
    portalManager.open((portalOption: Portal) => (
      <InducingLoginModal
        actionTitle={actionTitle}
        detailExplanation={`${actionTitle}${getTopicParticle(actionTitle)} 회원만 사용 가능합니다. 회원가입 또는 로그인 후 이용해주세요 :-)`}
        onClose={portalOption.close}
      />
    ));
  };
}
