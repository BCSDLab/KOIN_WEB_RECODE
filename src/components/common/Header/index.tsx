import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CATEGORY, { ICategory, ISubMenu } from 'static/category';
import cn from 'utils/ts/classnames';
import styles from './Header.module.scss';

const useMegaMenu = (category: ICategory[]) => {
  const [panelMenuList, setPanelMenuList] = useState<ISubMenu[] | null>();

  const createOnChangeMenu = (title: string) => () => {
    const selectedSubMenu = category
      .find((categoryInfo) => categoryInfo.title === title)?.submenu ?? null;
    setPanelMenuList(selectedSubMenu);
  };

  return {
    panelMenuList,
    createOnChangeMenu,
  };
};

function Header() {
  const { pathname } = useLocation();
  const { panelMenuList, createOnChangeMenu } = useMegaMenu(CATEGORY);
  // TODO: Auth 모듈이 만들어지면 그 때 변경
  const [token] = useState(false);

  return (
    <header
      className={cn({
        [styles.Header]: true,
        [styles['Header--main']]: pathname === '/',
      })}
    >
      <nav className={styles.Header__content}>
        <Link
          className={styles.Header__logo}
          to="/"
          tabIndex={0}
        >
          <img src="https://static.koreatech.in/assets/img/logo_white.png" alt="KOIN service logo" />
        </Link>
        <div
          className={cn({
            [styles['Header__mega-menu']]: true,
            [styles.MegaMenu]: true,
          })}
        >
          <ul className={styles['MegaMenu__trigger-list']}>
            {CATEGORY.map((category) => (
              <li
                key={category.title}
              >
                <button
                  className={styles.MegaMenu__trigger}
                  tabIndex={0}
                  type="button"
                  onClick={createOnChangeMenu(category.title)}
                  onFocus={createOnChangeMenu(category.title)}
                  onMouseOver={createOnChangeMenu(category.title)}
                >
                  {category.title}
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.MegaMenu__panel}>
            <ul className={styles.MegaMenu__content}>
              {panelMenuList?.map((menu) => (
                <li className={styles.MegaMenu__menu}>
                  {/* TODO: 키보드 Focus 접근성 향상 */}
                  <Link className={styles.MegaMenu__link} to={menu.link}>
                    {menu.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ul className={styles['Header__auth-menu']}>
          {!token ? (
            <>
              <li className={styles['Header__auth-link']}>
                <Link to="/signup">
                  회원가입
                </Link>
              </li>
              <li className={styles['Header__auth-link']}>
                <Link to="/login">
                  로그인
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className={styles['Header__auth-link']}>
                <Link to="/modifyinfo">
                  정보수정
                </Link>
              </li>
              <li className={styles['Header__auth-link']}>
                <Link to="/logout">
                  로그아웃
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
