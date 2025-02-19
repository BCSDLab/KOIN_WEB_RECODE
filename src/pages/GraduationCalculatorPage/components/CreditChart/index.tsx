import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from '@bcsdlab/utils';
import styles from "./CreditChart.module.scss";

const initialCredits = [
  {
    course_type: "자유선택",
    total_credit: "10",
    earned_credit: "5",
  },
  {
    course_type: "HRD필수",
    total_credit: "30",
    earned_credit: "15",
  },
  {
    course_type: "HRD선택",
    total_credit: "10",
    earned_credit: "3",
  },
  {
    course_type: "MSC선택",
    total_credit: "10",
    earned_credit: "4",
  },
  {
    course_type: "전공선택",
    total_credit: "20",
    earned_credit: "20",
  },
  {
    course_type: "전공필수",
    total_credit: "45",
    earned_credit: "30",
  },
  {
    course_type: "MSC필수",
    total_credit: "25",
    earned_credit: "15",
  },
];

function CreditChart() {
  const [creditState, setCreditState] = useState(initialCredits);

  const updateValues = (newValues: typeof initialCredits) => {
    setCreditState(newValues);
    // setCreditState((prevValues) =>
    //   prevValues.map((prev, index) => ({
    //     ...prev,
    //     earned_credit:
    //       prev.earned_credit !== newValues[index]?.earned_credit
    //         ? newValues[index]?.earned_credit
    //         : prev.earned_credit,
    //   }))
    // );
  };

  const handleUpdate = () => {
    let newValues = [...creditState];

    // 10% 확률로 막대 하나 삭제 (최소 1개 유지)
    if (Math.random() < 0.2 && newValues.length > 1) {
      newValues.splice(newValues.length - 1, 1);
    }
    // 10% 확률로 막대 하나 추가
    else if (Math.random() > 0.6) {
      newValues.push({
        course_type: `추가과목${newValues.length + 1}`,
        total_credit: String(Math.floor(Math.random() * 30) + 10),
        earned_credit: "0",
      });
    }

    // 기존 막대 일부 값 변경
    newValues = newValues.map((credit) => ({
      ...credit,
      earned_credit:
        Math.random() > 0.5
          ? String(Math.floor(Math.random() * Number(credit.total_credit)))
          : credit.earned_credit,
    }));

    updateValues(newValues);
  };

  useEffect(() => {
    console.log("creditState updated:", creditState);
  }, [creditState]);

  return (
    <div className={styles["credit-chart"]}>
      <div className={styles["credit-chart__axis"]}>
        {Array.from({ length: 13 }, (_, index) => 60 - index * 5).map(
          (credit, idx) => (
            <div key={idx} className={styles["credit-chart__row"]}>
              <div>{credit}</div>
              <div className={styles["credit-chart__contour"]} />
            </div>
          )
        )}
      </div>
      <motion.div layout className={styles["credit-chart__x-axis"]}>
        <AnimatePresence>
        {creditState.map((credit, index) => (
          <motion.div key={index} className={styles["credit-chart__course"]}              
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          layout>
            <div
              style={{
                width: "75px",
                height: `${Number(credit.total_credit) * 5}px`,
              }}
              className={styles["credit-chart__total-credit"]}
            >
              <motion.div
                style={{
                  width: "75px",
                  height: `${Number(credit.earned_credit) * 5}px`,
                }}
                initial={{ height: "0%" }}
                animate={{ height: `${Number(credit.earned_credit) * 5}px` }}
                transition={{ duration: 0.5 }}
                className={
                  cn({
                    [styles["credit-chart__earned-credit"]]: true,
                    [styles["credit-chart__earned-credit--full"]]: Number(credit.total_credit) - Number(credit.earned_credit) < 2 ,
                  })
                }
                layout
              />
              <div className={styles["credit-chart__credit-status"]}>
                {credit.earned_credit} / {credit.total_credit}
              </div>
            </div>
            <div className={styles["credit-chart__x-axis--name"]}>
              {credit.course_type}
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </motion.div>
      <button
        type="button"
        style={{ border: "1px solid black" }}
        onClick={handleUpdate}
      >
        값 변경 (추가/삭제 포함)
      </button>
    </div>
  );
}

export default CreditChart;
