import stylse from './NoticeSkeleton.module.scss';

export default function NoticeSkeleton() {
  return (
    <div className={stylse.container}>
      <div className={stylse.skeleton__wrapper}>
        <div className={stylse.skeleton__content} />
      </div>
      <div className={stylse.skeleton__wrapper}>
        <div className={stylse.skeleton__content} />
      </div>
      <div className={stylse.skeleton__wrapper}>
        <div className={stylse.skeleton__content} />
      </div>
      <div className={stylse.skeleton__wrapper}>
        <div className={stylse.skeleton__content} />
      </div>
      <div className={stylse.skeleton__wrapper}>
        <div className={stylse.skeleton__content} />
      </div>
    </div>
  );
}
