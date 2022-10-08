import { useRecoilState } from 'recoil';
import { modalState, MODAL_TYPES } from 'utils/recoil/ModalRecoil';
import ImageModal from './ImageModal';

const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.ImageModal]: ImageModal,
};

function GlobalModal() {
  const { modalType, modalProps } = useRecoilState(modalState)[0] || {};

  const renderComponent = () => {
    if (!modalType) {
      return null;
    }
    const ModalComponent = MODAL_COMPONENTS[modalType];

    return <ModalComponent {...modalProps} />;
  };

  return <>{renderComponent()}</>;
}

export default GlobalModal;
