import useModalPortal from 'utils/hooks/useModalPortal';
import { Portal } from 'components/common/Modal/PortalProvider';
import TimetableToast, { Toast } from 'components/common/Toast/TimetableToast';

export default function useToast() {
  const portalManager = useModalPortal();
  const open = ({
    message, recoverMessage, onRecover, duration = 3000,
  }: Omit<Toast, 'onClose'>) => {
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
