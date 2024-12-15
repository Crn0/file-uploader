import PropTypes from 'prop-types';

export default function FileComponent({ file }) {
  return (
    <div>
      {/* FILE BODY */}
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '50dvw' }}>
          <div>
            <span>{file.name}</span>
          </div>
          <div>
            <span>{file.type}</span>
          </div>
          <div>
            <span>{file.size}</span>
          </div>
          <div>
            <time>{file.createdAt}</time>
          </div>
        </div>
      </div>
    </div>
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
};
