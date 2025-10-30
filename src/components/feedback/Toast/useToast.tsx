import TimetableToast, { Toast } from 'components/feedback/Toast/TimetableToast';
import { Portal } from 'components/modal/Modal/PortalProvider';
import useModalPortal from 'utils/hooks/layout/useModalPortal';

export default function useToast() {
  const portalManager = useModalPortal();
  const open = ({ message, recoverMessage, onRecover, duration = 3000 }: Omit<Toast, 'onClose'>) => {
    portalManager.open((portalOption: Portal) => (
      <TimetableToast
        message={message}
        recoverMessage={recoverMessage}
        onRecover={onRecover}
        duration={duration}
        onClose={portalOption.close}
      />
    ));
  };
  return { open };
}
