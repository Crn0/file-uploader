import { useContext } from 'react';
import { useFetcher } from 'react-router-dom';
import AuthProvider from '../../../provider/auth.provider';
import UserContext from '../../../context/user.context';
import Input from '../form/Input';
import Button from '../button';
import Link from '../link';

export default function NavBar() {
  const user = useContext(UserContext);
  const fetcher = useFetcher({ key: 'logout' });

  const isSubmitting = fetcher.state === 'submitting';
  const isLoading = fetcher.state === 'loading';

  const handleLogout = () => {
    AuthProvider.user = null;
    AuthProvider.token = null;
  };
  return (
    <nav>
      {((isAuth) => {
        if (!isAuth) {
          return (
            <div>
              {['Register', 'Login'].map((url) => (
                <Link key={url} to={`${url}`}>
                  {url}
                </Link>
              ))}
            </div>
          );
        }

        return (
          <div>
            <fetcher.Form method='POST' action='/'>
              <Input type='hidden' name='intent' autoComplete='off' value='logout' />
              <Button
                type='submit'
                size='xs'
                onClick={handleLogout}
                isLoading={isLoading}
                disabled={isSubmitting}
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
