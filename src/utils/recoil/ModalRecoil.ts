import { atom } from 'recoil';

export const MODAL_TYPES = {
  ImageModal: 'ImageModal',
} as const;

export interface ImageModalProps {
  image: {}[]
}

export interface ImageModalType {
  modalType: typeof MODAL_TYPES.ImageModal;
  modalProps: ImageModalProps;
}

export type ModalType = ImageModalType;

export const modalState = atom<ModalType | null>({
  key: 'modalState',
  default: null,
});
