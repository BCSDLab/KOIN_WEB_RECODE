/* eslint-disable jsx-a11y/control-has-associated-label */
import QuestionMarkIcon from 'assets/svg/question-mark-icon.svg';
import UploadIcon from 'assets/svg/upload-icon.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import CloseIcon from 'assets/svg/common/close/close-icon-grey.svg';
import BubbleTailBottom from 'assets/svg/bubble-tail-bottom.svg';
// import usePostGraduationExcel from 'pages/GraduationCalculatorPage/hooks/usePostGraduationExcel';
import { useExcelUpload } from 'pages/GraduationCalculatorPage/hooks/useExcelUpload';
import styles from './ExcelUploader.module.scss';

function ExcelUploader() {
  const [isTooltipOpen, openTooltip, closeTooltip] = useBooleanState(false);
  const handleTooltipContent = () => {
    openTooltip();
  };

  const handleTooltipCloseButtonClick = () => {
    closeTooltip();
  };

  const { handleFileUpload } = useExcelUpload();

  return (
    <div className={styles['excel-uploader']}>
      <button
        type="button"
        onClick={handleTooltipContent}
        className={styles['excel-uploader__description-button']}
      >
        <QuestionMarkIcon />
      </button>
      <label className={styles['excel-uploader__button']}>
        <UploadIcon />
        <span>엑셀파일 추가하기</span>
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          className={styles['excel-uploader__input']}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </label>

      {isTooltipOpen && (
      <div className={styles['excel-uploader__tooltip']}>
        <div className={styles['excel-uploader__tooltip-content']}>
          아우누리에서 받은 엑셀 파일을
          <br />
          <strong>드래그&드랍</strong>
          하거나 이곳을
          <strong> 클릭해서</strong>
          <br />
          경로를 지정해 주세요.
        </div>
        <button type="button" aria-label="close" className={styles['excel-uploader__tooltip-close']} onClick={handleTooltipCloseButtonClick}>
          <CloseIcon />
        </button>
        <div className={styles['excel-uploader__tooltip-asset']}>
          <BubbleTailBottom />
        </div>
      </div>
      )}

    </div>
  );
}

export default ExcelUploader;
