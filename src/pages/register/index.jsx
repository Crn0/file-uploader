import { Suspense, useEffect } from 'react';
import {
  Await,
  useActionData,
  useAsyncValue,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import AuthProvider from '../../provider/auth.provider';
import Header from '../../components/ui/header';
import RegisterForm from './RegisterForm';
import Spinner from '../../components/ui/spinner';
import Link from '../../components/ui/link';
import styles from './css/index.module.css';

function Wrapper() {
  const actionData = useActionData();
  const asyncValue = useAsyncValue();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (asyncValue[1]) {
      const { user } = asyncValue[1];

      AuthProvider.user = user;

      const from = searchParams.get('from') || '/';

      navigate(from, { replace: true });
    }
  }, [asyncValue, navigate, searchParams]);

  return (
    <div>
      <Header />
      <main className={`${styles.grid} ${styles.grid_center}`}>
        <div
          className={`${styles.grid} ${styles.grid_center} ${styles.border_white}  ${styles.margin_top_5rem} ${styles.pad_4rem} ${styles.gap_1rem}`}
        >
          <div className={`${styles.grid} ${styles.grid_center} `}>
            <h1>Register</h1>
            <p>
              Already have an account?{' '}
              <Link to='/login' customStyles={`${styles.link_redirect}`}>
                Login
              </Link>
            </p>
          </div>

          {actionData && (
            <div>
              {((data) => {
                if (!data) return null;

                if (Array.isArray(data?.errors) && data.errors.length !== 0) {
                  return (
                    <>
                      {data.errors.map((e) => (
                        <p key={e.message} style={{ color: 'red' }}>
                          {e.message}
                        </p>
                      ))}
                    </>
                  );
                }
                return <p style={{ color: 'red' }}>{data?.message || data}</p>;
              })(actionData)}
            </div>
          )}

          <div>
            <RegisterForm />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Register() {
  const loaderData = useLoaderData();

  return (
    <Suspense fallback={<Spinner />}>
      <Await resolve={loaderData.data}>
        <Wrapper />
      </Await>
    </Suspense>
  );
}
