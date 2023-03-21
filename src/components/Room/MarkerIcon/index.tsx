import styles from './MarkerIcon.module.scss';

function MarkerIcon() {
  return `
    <div class="${styles.wrapper}">
      <div class="${styles.icon}"></div>
      <div class="${styles.pluse}"></div>
    </div>
  `;
}

export default MarkerIcon;
