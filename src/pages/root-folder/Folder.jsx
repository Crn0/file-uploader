import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import styles from './css/folder.module.css';

dayjs.extend(relativeTime);

export default function FolderComponent({ folder }) {
  const [currentId, setcurrentId] = useState(null);

  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/folders/${folder.id}`);
  };

  const onMouseOver = () => setcurrentId(folder.id);
  const onMouseLeave = () => setcurrentId(null);

  return (
    <tr
      className={`${currentId === folder.id ? styles.onHover : ''}`}
      onClick={handleRowClick}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseOver}
    >
      <td className={`${styles.td}`}>
        <div className={`${styles.td__name}`}>{folder.name}</div>
      </td>

      <td className={`${styles.td}`}>{folder.type}</td>
      <td className={`${styles.td}`}>—</td>
      <td className={`${styles.td}`}>{dayjs(folder.createdAt).fromNow()}</td>
    </tr>
  );
}

FolderComponent.propTypes = {
  folder: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    ownerId: PropTypes.number.isRequired,
    parentId: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
};
