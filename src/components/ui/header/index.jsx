import Link from '../link';
import NavBar from '../nav-bar';
import style from './css/index.module.css';

export default function Header() {
  return (
    <header>
      <div className={`${style.header__left}`}>
        <div className={`${style.header__btn} ${style.center}}`}>
          <Link to='/'>File Uploader</Link>
        </div>
      </div>

      <div className={`${style.header__right}`}>
        <NavBar />
      </div>
    </header>
  );
}
