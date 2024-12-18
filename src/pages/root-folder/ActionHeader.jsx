import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useAsyncValue } from 'react-router-dom';
import Modal from '../../components/ui/modal';
import ResourceForm from './ResourceForm';
import styles from './css/action-header.module.css';
import Link from '../../components/ui/link';

export default function ActionHeader({ setFolders, setFiles }) {
  const [error, asyncData] = useAsyncValue();

  if (error) throw error;

  const folder = asyncData?.data.folder;
  const paths = asyncData?.path;

  useEffect(() => {
    if (folder) {
      setFolders(folder.folders);
      setFiles(folder.files);
    }
  }, [error, folder, setFiles, setFolders]);

  return (
    <>
      <div>
        {paths?.map((path) => (
          <h1 key={path.id}>
            <Link to='/'>{path.name}</Link>
          </h1>
        ))}
      </div>

      <div>
        <Modal title='New Folder' buttonText='New Folder'>
          <ResourceForm
            action='/root-folder'
            method='POST'
            intent='create:folder'
            setState={setFolders}
            labelName='Name:'
            folderId={String(folder.id)}
            inputFieldId={`${styles.folder__name__field}`}
            buttonFieldId={`${styles.folder__button__field}`}
            testId='btn__new__folder'
            buttonSize='xs'
            buttonText='Create'
            type='folder'
          />
        </Modal>

        <Modal title='New File' buttonText='New File'>
          <ResourceForm
            action='/root-folder'
            method='POST'
            intent='create:file'
            setState={setFiles}
            labelName='Select File'
            folderId={String(folder.id)}
            inputFieldId={`${styles.file__name__field}`}
            buttonFieldId={`${styles.file__button__field}`}
            testId='btn__new__file'
            buttonSize='xs'
            buttonText='Upload'
            type='file'
          />
        </Modal>
      </div>
    </>
  );
}

ActionHeader.propTypes = {
  setFolders: PropTypes.func.isRequired,
  setFiles: PropTypes.func.isRequired,
};
