import CallvanToast from 'components/Callvan/components/CallvanToast';
import { Portal } from 'components/modal/Modal/PortalProvider';
import useModalPortal from 'utils/hooks/layout/useModalPortal';

export default function useCallvanToast() {
  const portalManager = useModalPortal();

  const open = (message: string) => {
    portalManager.open((portalOption: Portal) => (
      <CallvanToast message={message} onClose={portalOption.close} />
    ));
  };

  return { open };
}
