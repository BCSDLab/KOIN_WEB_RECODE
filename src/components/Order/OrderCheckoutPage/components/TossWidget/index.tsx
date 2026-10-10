import { useEffect, type Dispatch, type SetStateAction } from 'react';

import { loadTossPayments, type TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk';

import styles from './TossWidget.module.scss';

// KOIN_ORDER_WEBVIEW pages/Payment/components/TossWidget 이전. 결제 수단·이용약관 위젯을 그린다.
// 테스트 키는 order와 같다(결제 승인은 B9에서 다시 정한다)
const CLIENT_KEY = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
const CUSTOMER_KEY = 'RIjiDf_DbIaGaFMTcj3_v';

interface TossWidgetProps {
  widgets: TossPaymentsWidgets | null;
  setWidgets: Dispatch<SetStateAction<TossPaymentsWidgets | null>>;
  setReady: Dispatch<SetStateAction<boolean>>;
  amount: { currency: string; value: number };
  setAgreement: Dispatch<SetStateAction<boolean>>;
}

export default function TossWidget({ widgets, setWidgets, setReady, amount, setAgreement }: TossWidgetProps) {
  useEffect(() => {
    let isActive = true;

    const fetchPaymentWidgets = async () => {
      const tossPayments = await loadTossPayments(CLIENT_KEY);
      // 회원 결제
      if (isActive) setWidgets(tossPayments.widgets({ customerKey: CUSTOMER_KEY }));
    };
    fetchPaymentWidgets().catch((error: unknown) => console.error(error));

    return () => {
      isActive = false;
    };
  }, [setWidgets]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let isActive = true;

    const renderPaymentWidgets = async () => {
      if (widgets === null) return;
      await widgets.setAmount(amount);

      const [paymentWidget, agreementWidget] = await Promise.all([
        widgets.renderPaymentMethods({ selector: '#payment-method', variantKey: 'DEFAULT' }),
        widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' }),
      ]);

      agreementWidget.on?.('agreementStatusChange', (status) => {
        setAgreement(status.agreedRequiredTerms);
      });

      cleanup = () => {
        paymentWidget.destroy?.();
        agreementWidget.destroy?.();
      };
      if (!isActive) {
        cleanup();

        return;
      }

      setReady(true);
    };
    renderPaymentWidgets().catch((error: unknown) => console.error(error));

    return () => {
      isActive = false;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- order처럼 위젯 인스턴스가 정해질 때 한 번만 그린다. 금액 변경은 아래 효과가 반영한다
  }, [widgets]);

  const { currency, value } = amount;
  useEffect(() => {
    if (widgets === null) return;
    widgets.setAmount({ currency, value }).catch((error: unknown) => console.error(error));
  }, [widgets, currency, value]);

  return (
    <div className={styles.widget}>
      <div className={styles.widget__inner}>
        {/* 결제 UI */}
        <div id="payment-method" className={styles.widget__area} />
        {/* 이용약관 UI */}
        <div id="agreement" className={styles.widget__area} />
      </div>
    </div>
  );
}
