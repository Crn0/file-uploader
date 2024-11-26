import { useActionData } from 'react-router-dom';
import Link from '../../components/ui/link';
import RegisterForm from './RegisterForm';

export default function Register() {
  const actionData = useActionData();

  return (
    <main>
      <section>
        <div>
          <h1>Register</h1>
          <p>
            Already have an account? <Link to='/login'>Login</Link>
          </p>
        </div>

        <div>
          {actionData &&
            actionData?.errors?.map((error) => <p key={error.message}>{error.message}</p>)}
        </div>

        <div>
          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
