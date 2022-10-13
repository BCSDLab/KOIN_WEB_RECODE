import { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface ProviderProps {
  children: ReactNode
}

const ModalProvider = ({ children }: ProviderProps) => {
  const el = document.getElementById('modal') as HTMLElement;

  return ReactDOM.createPortal(children, el);
};

export default ModalProvider;
