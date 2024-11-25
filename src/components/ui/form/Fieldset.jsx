import PropTypes from 'prop-types';

export default function Fieldset({ children, id }) {
  return <div id={id}>{children}</div>;
}

Fieldset.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
    .isRequired,
  id: PropTypes.string.isRequired,
};
