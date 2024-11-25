import PropTypes from 'prop-types';
import { useNavigation, useLocation } from 'react-router-dom';
import Form from '../../components/ui/form';
import Fieldset from '../../components/ui/form/Fieldset';
import Label from '../../components/ui/form/Label';
import Input from '../../components/ui/form/Input';
import Button from '../../components/ui/button';
import style from './css/form.module.css';

const GOOGLE_URL = `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/google`;

export default function LoginForm({ customStyles = '' }) {
  const location = useLocation();
  const navigation = useNavigation();

  const from = location.state?.from || '/';
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Form action='/login' method='POST' customStyles={customStyles}>
      <Input type='hidden' name='redirectTo' value={from} autoComplete='off' />
      <Fieldset id={style.email_pwd__field}>
        <Label name='Email:'>
          <Input type='email' name='email' autoComplete='off' uncontrolled />
        </Label>

        <Label name='Password:'>
          <Input type='password' name='password' autoComplete='new-password' uncontrolled />
        </Label>
      </Fieldset>

      <Fieldset id={style.btn__field}>
        {(() => {
          if (isSubmitting)
            return (
              <Button
                type='button'
                size='m'
                isLoading={isSubmitting}
                disabled={isSubmitting}
                testId='btn_login'
              >
                Login
              </Button>
            );

          return (
            <Button type='submit' size='m' testId='btn_login'>
              Login
            </Button>
          );
        })()}
      </Fieldset>

      <Fieldset id={style.oauth__field}>
        <a className={`${style.link__oauth}`} href={GOOGLE_URL}>
          Or Login with Google
        </a>
      </Fieldset>
    </Form>
  );
}

LoginForm.propTypes = {
  customStyles: PropTypes.string,
};
