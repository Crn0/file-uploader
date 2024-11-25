import PropTypes from 'prop-types';
import styles from './css/errorMessage.module.css';

export default function ErrorMessage({ message, customStyles = '' }) {
  return <p className={`${styles.error__message} ${customStyles}`}>{message}</p>;
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  customStyles: PropTypes.string,
};
