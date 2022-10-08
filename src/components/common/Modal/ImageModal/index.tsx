import useModal from 'utils/hooks/useModal';
import styles from './ImageModal.module.scss';

export interface ImageModalProps {
  image: {}[]
}

function ImageModal({
  image,
}: ImageModalProps) {
  const { hideModal } = useModal();
  console.log(image, hideModal);
  return (
    <div className={styles.background}>
      <div className={styles.image}>
        img
      </div>
    </div>
  );
}

export default ImageModal;
