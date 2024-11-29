import { useEffect } from 'react';
import { useNavigate, useAsyncValue } from 'react-router-dom';
import AuthProvider from '../../provider/auth.provider';

export default function SilentLogin() {
  const [error, data] = useAsyncValue();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) navigate('/login', { replace: true });
    if (data) {
      AuthProvider.user = data;
      navigate('/', { replace: true });
    }

    return () => {};
  }, [error, data, navigate]);
}
