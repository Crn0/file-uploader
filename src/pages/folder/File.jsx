import PropTypes from 'prop-types';
import { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import helpers from '../../helpers';
import styles from './css/file.module.css';

dayjs.extend(relativeTime);

export default function FileComponent({ file, setActiveId }) {
  const open = () => setActiveId(file.id);
  const [currentId, setcurrentId] = useState(null);

  const onMouseOver = () => setcurrentId(file.id);
  const onMouseLeave = () => setcurrentId(null);

  return (
    <tr
      onClick={open}
      className={`${currentId === file.id ? styles.onHover : ''}`}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseOver}
    >
      <td className={`${styles.td}`}>
        <div className={`${styles.td__name}`}>{file.name}</div>
      </td>
      <td className={`${styles.td}`}>{file.type}</td>
      <td className={`${styles.td}`}>{helpers.formatBytes(file.size)}</td>

      <td className={`${styles.td}`}>{dayjs(file.createdAt).fromNow()}</td>
    </tr>
  );
}

FileComponent.propTypes = {
  file: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    publicId: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    ownerId: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    extension: PropTypes.string.isRequired,
    deliveryType: PropTypes.string.isRequired,
    resourceType: PropTypes.string.isRequired,
  }),
  setActiveId: PropTypes.func.isRequired,
};
