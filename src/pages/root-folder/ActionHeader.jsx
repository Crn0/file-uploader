import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useAsyncValue } from 'react-router-dom';
import Modal from '../../components/ui/modal';
import ResourceForm from './ResourceForm';
import Link from '../../components/ui/link';
import styles from './css/action-header.module.css';

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
            <Link to='/' customStyles={`${styles.link}`}>
              {path.name}
            </Link>
          </h1>
        ))}
      </div>

      <div className={` ${styles.pos_relative} ${styles.flex} ${styles.gap_1}`}>
        <Modal
          title='New Folder'
          buttonText='New Folder'
          buttonCustomStyles={`${styles.background_none} ${styles.modal__btn__open}`}
          dialogContainerCustomStyles={`${styles.dialog__container}`}
          dialogCustomStyles={`${styles.dialog}`}
          dialogTopCustomStyles={`${styles.flex} ${styles.space_between}`}
          modalButtonContainerCustomStyles={`${styles.modal__btn__container}`}
          modalCloseButtonCustomStyles={`${styles.modal__btn}`}
        >
          <ResourceForm
            action='/root-folder'
            method='POST'
            intent='create:folder'
            setState={setFolders}
            inputPlaceHolder='Folder Name'
            folderId={String(folder.id)}
            inputFieldId={`${styles.folder__name__field}`}
            buttonFieldId={`${styles.folder__button__field}`}
            testId='btn__new__folder'
            buttonSize='xs'
            buttonText='Create'
            type='folder'
            formCustomStyles={`${styles.grid} ${styles.grid_center} ${styles.gap_2}`}
            buttonCustomStyles={`${styles.form__btn}`}
          />
        </Modal>

        <Modal
          title='New File'
          buttonText='New File'
          buttonCustomStyles={`${styles.background_none} ${styles.modal__btn__open}`}
          dialogContainerCustomStyles={`${styles.dialog__container}`}
          dialogCustomStyles={`${styles.dialog}`}
          dialogTopCustomStyles={`${styles.flex} ${styles.space_between}`}
          modalButtonContainerCustomStyles={`${styles.modal__btn__container}`}
          modalCloseButtonCustomStyles={`${styles.modal__btn}`}
        >
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
            formCustomStyles={`${styles.flex} ${styles.space_between}`}
            buttonCustomStyles={`${styles.form__btn}`}
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
