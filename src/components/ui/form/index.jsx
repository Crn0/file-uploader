import PropTypes from 'prop-types';
import { Form as ReactForm } from 'react-router-dom';
import style from './css/index.module.css';

export default function Form({
  action,
  method,
  children,
  encType = 'application/x-www-form-urlencoded',
  onSubmit = () => {},
  customStyles = '',
}) {
  return (
    <ReactForm
      aria-label='form'
      onSubmit={onSubmit}
      action={action}
      method={method}
      encType={encType}
      className={`${style.form} ${customStyles}`}
      replace
    >
      {children}
    </ReactForm>
  );
}

Form.propTypes = {
  action: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
    .isRequired,
  onSubmit: PropTypes.func,
  customStyles: PropTypes.string,
  encType: PropTypes.string,
};
