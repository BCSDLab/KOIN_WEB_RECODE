/* eslint-disable react/no-array-index-key */
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from 'static/policy';
import styles from './PolicyPage.module.scss';

function PolicyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.body__content}>
          <h2 className={styles['body__content--title']}>코인 개인정보처리방침</h2>
          {PRIVACY_POLICY.map((policy) => (
            <section className={styles.policy} key={policy.id}>
              <h3 className={styles.policy__title}>{policy.title}</h3>
              {Array.isArray(policy.content) ? (
                policy.content.map((text, index) => (
                  <div className={styles.policy__content} key={index}>{text}</div>
                ))
              ) : (
                <div className={styles.policy__content}>{policy.content}</div>
              )}
              {policy.items && (
                <ul>
                  {policy.items.map((item, index) => (
                    <li className={styles.policy__items} key={index}>{item}</li>
                  ))}
                </ul>
              )}
              {policy.additionalContent && (
                <div className={styles.policy__content}>{policy.additionalContent}</div>
              )}
              {policy.additionalItems && (
                <ul>
                  {policy.additionalItems.map((item, index) => (
                    <li className={styles.policy__items} key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        <div className={styles.body__content}>
          <h2 className={styles['body__content--title']}>코인 이용약관</h2>
          {TERMS_OF_SERVICE.map((terms) => (
            <section className={styles.policy} key={terms.id}>
              <h3 className={styles.policy__title}>{terms.title}</h3>
              {Array.isArray(terms.content) ? (
                terms.content.map((text, index) => (
                  <div className={styles.policy__content} key={index}>{text}</div>
                ))
              ) : (
                <div className={styles.policy__content}>{terms.content}</div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
export default PolicyPage;
