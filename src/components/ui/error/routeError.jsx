import { useContext } from 'react';
import { useRouteError } from 'react-router-dom';
import ThemeContext from '../../../context/ThemeContext';
import Link from '../../Link';

export default function MainError() {
  const error = useRouteError();
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`${theme}`}>
      <h2>Oops</h2>
      <p>Sorry, an unexpected error has occurred</p>
      <Link to='/'>Home</Link>
      <p>
        <i>{error.status || error.code}</i>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
