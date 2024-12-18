import Link from '../link';
import NavBar from '../nav-bar';
import style from './css/index.module.css';

export default function Header() {
  return (
    <header className={`${style.header} ${style['pad-1rem']} ${style['header--dark']}`}>
      <div className={`${style.header__left}`}>
        <div className={`${style.header__btn} ${style.center} ${style['btn--dark']}`}>
          <Link customStyles={`${style.link} ${style['link--dark']}`} to='/'>
            File Uploader
          </Link>
        </div>
      </div>

      <NavBar customStyles={`${style.header__right}`} />
    </header>
  );
}
