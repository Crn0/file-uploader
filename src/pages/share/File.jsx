import PropTypes from 'prop-types';

export default function FileComponent({ file, setActiveId }) {
  const open = () => setActiveId(file.id);

  return (
    <tr onClick={open}>
      <td>{file.name}</td>
      <td>{file.type}</td>
      <td>{file.size}</td>
      <td>{file.createdAt}</td>
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
