import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import style from './css/link.module.css';

export default function Link({ to, children, customStyles = '' }) {
  return (
    <RouterLink hrefLang='' to={to} className={`${style.a} ${customStyles}`}>
      {children}
    </RouterLink>
  );
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  customStyles: PropTypes.string,
  children: PropTypes.node.isRequired,
};
