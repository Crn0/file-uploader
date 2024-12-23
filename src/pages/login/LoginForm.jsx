import { useNavigation, useLocation } from 'react-router-dom';
import Form from '../../components/ui/form';
import Label from '../../components/ui/form/Label';
import Input from '../../components/ui/form/Input';
import Button from '../../components/ui/button';
import Spinner from '../../components/ui/spinner';
import styles from './css/form.module.css';

const GOOGLE_URL = `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/google`;

export default function LoginForm() {
  const location = useLocation();
  const navigation = useNavigation();

  const from = location.state?.from || '/';
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Form action='/login' method='POST' customStyles={`${styles.form}`}>
      <Input type='hidden' name='redirectTo' value={from} autoComplete='off' />
      <div>
        <Label name='Email:'>
          <Input
            type='email'
            name='email'
            autoComplete='off'
            customStyles={`${styles.block}`}
            uncontrolled
          />
        </Label>
      </div>

      <div>
        <Label name='Password:'>
          <Input
            type='password'
            name='password'
            autoComplete='new-password'
            customStyles={`${styles.block}`}
            uncontrolled
          />
        </Label>
      </div>

      <div
        className={`${styles.flex} ${styles.flex_center} ${styles.margin_top_2rem} ${styles.gap_1rem}`}
      >
        {(() => {
          if (isSubmitting)
            return (
              <>
                <Button
                  type='button'
                  size='m'
                  customStyles={`${styles.button}`}
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  testId='btn_login'
                >
                  Login
                </Button>
                <a
                  className={`${styles.link_btn} ${isSubmitting ? styles.link_disable : ''}`}
                  href={GOOGLE_URL}
                  onClick={(e) => e.preventDefault()}
                >
                  {isSubmitting ? <Spinner /> : <span>Google</span>}
                </a>
              </>
            );

          return (
            <>
              <Button type='submit' size='m' customStyles={`${styles.button}`} testId='btn_login'>
                Login
              </Button>
              <a className={`${styles.link_btn}`} href={GOOGLE_URL}>
                Google
              </a>
            </>
          );
        })()}
      </div>
    </Form>
  );
}
