import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export default function FolderComponent({ folder, url }) {
  const navigate = useNavigate();
  const handleRowClick = () => {
    const to = `${url}&folderId=${folder.id}&type=sub-folder`;
    navigate(to);
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
  url: PropTypes.string.isRequired,
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
