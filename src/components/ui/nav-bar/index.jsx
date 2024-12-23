import Proptypes from 'prop-types';
import { useContext } from 'react';
import { useFetcher } from 'react-router-dom';
import AuthProvider from '../../../provider/auth.provider';
import UserContext from '../../../context/user.context';
import Input from '../form/Input';
import Button from '../button';
import Link from '../link';
import style from './css/index.module.css';

export default function NavBar({ customStyles = '' }) {
  const user = useContext(UserContext);
  const fetcher = useFetcher({ key: 'logout' });

  const isSubmitting = fetcher.state === 'submitting';
  const isLoading = fetcher.state === 'loading';

  const handleLogout = () => {
    AuthProvider.user = null;
    AuthProvider.token = null;
  };

  return (
    <nav className={`${style.center}`}>
      {((isAuth) => {
        if (!isAuth) {
          return (
            <div className={`${style.center}  ${customStyles}`}>
              {['Register', 'Login'].map((url) => (
                <div key={url} className={`${style.center}`}>
                  <Link to={`/${url}`} customStyles={`${style.link} ${style['link--dark']}`}>
                    {url}
                  </Link>
                </div>
              ))}
            </div>
          );
        }

        return (
          <div className={`${style.center}  ${customStyles}`}>
            <fetcher.Form method='POST' action='/'>
              <Input type='hidden' name='intent' autoComplete='off' value='logout' />
              <Button
                type='submit'
                size='xs'
                onClick={handleLogout}
                isLoading={isLoading}
                disabled={isSubmitting}
                customStyles={`${style.link} ${style['link--dark']}`}
              >
                Logout
              </Button>
            </fetcher.Form>
          </div>
        );
      })(user?.username)}
    </nav>
  );
}

NavBar.propTypes = {
  customStyles: Proptypes.string,
};
