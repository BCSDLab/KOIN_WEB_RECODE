import KoinToast from 'components/common/KoinToast';
import { Portal } from 'components/common/Modal/PortalProvider';
import useModalPortal from 'utils/hooks/layout/useModalPortal';

interface Props {
  message: string;
  ms?: number;
}

export const useKoinToast = () => {
  const portalManager = useModalPortal();

  const openToast = ({ message, ms }: Props) => {
    portalManager.open((portal: Portal) => (
      <KoinToast close={portal.close} message={message} ms={ms} />
    ));
  };

  return openToast;
};
