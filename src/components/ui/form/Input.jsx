import PropTypes from 'prop-types';
import './css/input.module.css';

export default function Input({
  type,
  name,
  autoComplete,
  uncontrolled = false,
  isDisabled = false,
  value = '',
  customStyles = '',
  placeholder = '',
  onChange = () => {},
  onClick = () => {},
  onKeyDown = () => {},
  onBlur = () => {},
}) {
  if (uncontrolled) {
    return (
      <input
        className={`${customStyles}`}
        type={type}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        onClick={onClick}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={isDisabled}
        autoComplete={autoComplete}
        required
      />
    );
  }

  return (
    <input
      className={`${customStyles}`}
      type={type}
      name={name}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      onClick={onClick}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={isDisabled}
      required
    />
  );
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  autoComplete: PropTypes.string.isRequired,
  customStyles: PropTypes.string,
  placeholder: PropTypes.string,
  uncontrolled: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
};
