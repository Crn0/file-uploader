import PropTypes from 'prop-types';
import ErrorMessage from '../error/errorMessage';
import helpers from '../../../helpers';

const { fieldMessage, fieldNameIncludes } = helpers;

export default function FieldErrorMessage({ fieldName, error, customStyles = '' }) {
  const messages = error?.messages;

  if (fieldNameIncludes(fieldName, messages))
    return <ErrorMessage customStyles={customStyles} message={fieldMessage(fieldName, messages)} />;
}

FieldErrorMessage.propTypes = {
  fieldName: PropTypes.string.isRequired,
  error: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  customStyles: PropTypes.string,
};
