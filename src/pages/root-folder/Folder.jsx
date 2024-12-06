import PropTypes from 'prop-types';
import Link from '../../components/ui/link';
import Button from '../../components/ui/button';

export default function FolderComponent({ folder }) {
  // console.log(folder);
  return (
    <div style={{ display: 'flex' }}>
      <Link to={`/folders/${folder.id}`}>
        {/* <Button type='button' size='lg' testId='button__folder__link'>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '50dvw' }}>
            <p>{folder.name}</p>
            <p>{folder.type}</p>
            <p>—</p>
            <time>{folder.createdAt}</time>
          </div>
        </Button> */}
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
