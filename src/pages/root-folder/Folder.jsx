import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export default function FolderComponent({ folder }) {
  const navigate = useNavigate();
  const handleRowClick = () => {
    navigate(`/folders/${folder.id}`);
  };
  return (
    <tr onClick={handleRowClick}>
      <td>{folder.name}</td>

      <td>{folder.type}</td>
      <td>—</td>
      <td>{folder.createdAt}</td>
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
