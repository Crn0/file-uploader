import { useEffect } from 'react';
import { useNavigate, useAsyncValue, useLocation } from 'react-router-dom';
import AuthProvider from '../../provider/auth.provider';

export default function SilentLogin() {
  const [error, data] = useAsyncValue();
  const navigate = useNavigate();
  const location = useLocation();

  console.log(location);

  useEffect(() => {
    if (error) navigate('/login', { replace: true });
    if (data) {
      AuthProvider.user = data;
      navigate('/', { replace: true });
    }

    return () => {};
  }, [error, data, navigate]);
}
