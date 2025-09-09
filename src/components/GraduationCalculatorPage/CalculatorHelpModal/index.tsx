import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './CalculatorHelpModal.module.scss';

interface CalculatorHelpModalProps {
  closeInfo: () => void;
}

function CalculatorHelpModal({ closeInfo }: CalculatorHelpModalProps) {
  const { backgroundRef } = useOutsideClick({ onOutsideClick: closeInfo });

  useEscapeKeyDown({ onEscape: closeInfo });

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.container}>
        <h1 className={styles.container__title}>코인 졸업학점 계산기는 어떤 기능인가요?</h1>
        <div>
          <p className={styles.container__description}>
            코인 졸업학점 계산기는 전공•학번별
            <strong> 졸업 필요 학점과 이수학점을 비교해줘요.</strong>
          </p>
          <p className={styles.container__description}>
            아우누리에서 성적이력 엑셀 파일을 받아 넣으면 편리하게 이수한 모든 강의를 가져올 수 있어요!
          </p>
        </div>
        <h1 className={styles.container__title}>성적이력 엑셀 파일이요?</h1>
        <div className={styles.container__content}>
          <img
            className={styles['container__content-image']}
            src="https://static.koreatech.in/assets/img/graduation-credit-calculator/aunuri-guide.png"
            alt="아우누리 성적이력 엑셀 파일 다운로드 가이드"
          />
          <div className={styles['container__content-description']}>
            <p>성적이력 엑셀 파일은 아우누리에서 다운로드 받을 수 있는 파일이에요.</p>
            <p className={styles['container__content-description--thin']}>{'아우누리 > 학사 탭 > 학적기본 폴더 >'}</p>
            <p className={styles['container__content-description--thin']}>{'학적기본사항 파일 > 성적이력 탭 클릭 >우측 엑셀 아이콘 클릭'}</p>
            <p>다운로드한 엑셀 파일을 그대로 올리면 돼요.</p>
            <p className={styles['container__content-description--bold']}>
              엑셀의 학생 개인의 점수와 학점은
              <strong> 수집되지 않아요.</strong>
            </p>
            <p>졸업학점 계산기는 데스크탑 웹에서 이용 가능해요.</p>
            <p>졸업학점 계산기를 사용하기 위해서는 회원가입이 필수에요.</p>
          </div>
        </div>
        <div className={styles['container__button-container']}>
          <a
            href="https://portal.koreatech.ac.kr"
            className={styles['container__button-container--button']}
            target="_blank"
            rel="noreferrer"
          >
            아우누리 바로가기
          </a>
          <button
            type="button"
            aria-label="닫기 버튼"
            className={styles['container__button-container--button']}
            onClick={() => {
              closeInfo();
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default CalculatorHelpModal;
