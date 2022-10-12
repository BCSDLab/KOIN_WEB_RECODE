import { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  modal: ReactNode
}

export default function useModalPortal() {
  const showModal = ({ modal }: ModalProps) => {
    const el = document.getElementById('modal') as HTMLElement;

    return ReactDOM.createPortal(modal, el);
  };

  return {
    showModal,
  };
}
