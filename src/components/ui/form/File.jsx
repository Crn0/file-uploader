import PropTypes from 'prop-types';
import { forwardRef } from 'react';

function FileRef(
  {
    name,
    onChange,
    onKeyDown = () => {},
    customStyles = '',
    filesAccept = '.png, .jpeg, .jpg, .webp, .epub',
  },
  ref,
) {
  return (
    <input
      ref={ref}
      type='file'
      className={`${customStyles}`}
      name={name}
      onChange={onChange}
      onKeyDown={onKeyDown}
      accept={filesAccept}
    />
  );
}

const File = forwardRef(FileRef);

FileRef.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  customStyles: PropTypes.string,
  filesAccept: PropTypes.string,
  onKeyDown: PropTypes.func,
};

export default File;
