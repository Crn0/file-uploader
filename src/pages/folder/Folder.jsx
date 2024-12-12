import PropTypes from 'prop-types';
import Link from '../../components/ui/link';

export default function FolderComponent({ folder }) {
  return (
    <div style={{ display: 'flex' }}>
      <Link to={`/folders/${folder?.id}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '50dvw' }}>
          <p>{folder.name}</p>
          <p>{folder.type}</p>
          <p>—</p>
          <time>{folder.createdAt}</time>
        </div>
      </Link>
    </div>
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
