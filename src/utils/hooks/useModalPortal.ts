import { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  modal: ReactNode
  isOpen: boolean
}

export default function useModalPortal() {
  const showModal = ({ modal, isOpen }: ModalProps) => {
    const el = document.getElementById('modal') as HTMLElement;

    return isOpen && ReactDOM.createPortal(modal, el);
  };

  return {
    showModal,
  };
}
