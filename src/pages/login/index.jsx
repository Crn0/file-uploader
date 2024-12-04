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
import LoginForm from './LoginForm';
import Link from '../../components/ui/link';
import Spinner from '../../components/ui/spinner';

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
    <main>
      <section>
        <div>
          <h1>Login</h1>
          <p>
            Don&apos;t have an account yet? <Link to='/register'>Register</Link>
          </p>
        </div>

        <div>
          {((data) => {
            if (Array.isArray(data?.errors)) {
              return (
                <>
                  {data.errors.map((e) => (
                    <p key={e.message}>{e.message}</p>
                  ))}
                </>
              );
            }

            if (data?.message) return <p>{data.message}</p>;

            return null;
          })(actionData)}
        </div>

        <div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}

export default function Login() {
  const loaderData = useLoaderData();

  return (
    <Suspense fallback={<Spinner />}>
      <Await resolve={loaderData.data}>
        <Wrapper />
      </Await>
    </Suspense>
  );
}
