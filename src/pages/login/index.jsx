import { useActionData } from 'react-router-dom';
import LoginForm from './LoginForm';
import Link from '../../components/ui/Link';

export default function Login() {
  const actionData = useActionData();

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
