import PropTypes from 'prop-types';
import Link from '../../components/ui/link';

export default function FolderComponent({ folder, url }) {
  const to = `${url}&folderId=${folder.id}&type=sub-folder`;

  return (
    <div style={{ display: 'flex' }}>
      <Link to={to}>
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
