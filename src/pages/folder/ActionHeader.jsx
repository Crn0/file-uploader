import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useActionData, useAsyncValue, useNavigation } from 'react-router-dom';
import Modal from '../../components/ui/modal';
import ResourceForm from './ResourceForm';
import Form from '../../components/ui/form';
import Link from '../../components/ui/link';
import Button from '../../components/ui/button';
import Input from '../../components/ui/form/Input';
import Label from '../../components/ui/form/Label';
import styles from './css/action-header.module.css';

export default function ActionHeader({ setFolders, setFiles, resourceAction, dispatch }) {
  const [
    error,
    {
      path: paths,
      data: { folder },
    },
  ] = useAsyncValue();

  const actionDataExist = useActionData();
  const [actionData, setActionData] = useState(null);
  const [copyToClipBoard, setCopyToClipBoard] = useState(false);

  const navigation = useNavigation();
  const [radioIndex, setRadioIndex] = useState(null);

  const isSubmitting = navigation.state === 'submitting';

  const resourceActionIsLoading = (action, id) =>
    isSubmitting === true &&
    resourceAction.folder[action].on &&
    resourceAction.folder[action].id === id;

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(actionData.url);
    setCopyToClipBoard(true);
  };

  const onSubmit = () => {
    dispatch({
      field: 'folder',
      type: 'folder:delete',
      value: {
        id: folder.id,
        on: true,
      },
    });
  };

  useEffect(() => {
    if (error) throw error;

    if (actionDataExist) {
      setActionData(actionDataExist[1]);
    }

    if (folder) {
      setFolders(folder.folders);
      setFiles(folder.files);
    }
  }, [actionDataExist, error, folder, setFiles, setFolders]);

  return (
    <>
      <div className={`${styles.flex} ${styles.gap_1} ${styles.flex__wrap}`}>
        {paths?.map((path, index) => {
          if (index !== paths.length - 1) {
            return (
              <div key={path.id} className={`${styles.flex} ${styles.gap_1} ${styles.flex__wrap}`}>
                <div>
                  <Link to={`/folders/${path.id}`} customStyles={`${styles.link}`}>
                    {path.name}
                  </Link>
                </div>

                <div>
                  <span className={`${styles.font_2em}`}> {'>'} </span>
                </div>
              </div>
            );
          }

          return (
            <div key={path.id} className={`${styles.flex} ${styles.gap_1} ${styles.flex__wrap}`}>
              <Link key={path.id} to={`/folders/${path.id}`} customStyles={`${styles.link}`}>
                {path.name}
              </Link>
            </div>
          );
        })}
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

        {(() => {
          if (folder.parentId === null) return null;

          return (
            <>
              <Modal
                title='Share'
                buttonText='Share'
                buttonCustomStyles={`${styles.background_none} ${styles.modal__btn__open}`}
                dialogContainerCustomStyles={`${styles.dialog__container}`}
                dialogCustomStyles={`${styles.dialog}`}
                dialogTopCustomStyles={`${styles.flex} ${styles.space_between}`}
                modalButtonContainerCustomStyles={`${styles.modal__btn__container}`}
                modalCloseButtonCustomStyles={`${styles.modal__btn}`}
                cleanup={() => {
                  setActionData(null);
                  setCopyToClipBoard(false);
                  dispatch({
                    field: 'folder',
                    type: 'folder:share',
                    value: {
                      id: null,
                      on: false,
                    },
                  });
                }}
              >
                <div>
                  <Form
                    action={`/folders/${folder.id}`}
                    method='POST'
                    customStyles={`${styles.share__form}`}
                  >
                    <Input type='hidden' name='intent' value='folder:share' autoComplete='off' />
                    <Input
                      type='hidden'
                      name='folderId'
                      value={String(folder.id)}
                      autoComplete='off'
                    />
                    <fieldset>
                      <legend>Genarate a link to share</legend>
                      <div>
                        <Label name='1 hour'>
                          <Input
                            type='radio'
                            name='expiration'
                            value='1h'
                            autoComplete='off'
                            onChange={() => setRadioIndex(1)}
                            checked={radioIndex === 1}
                          />
                        </Label>
                      </div>

                      <div>
                        <Label name='1 day'>
                          <Input
                            type='radio'
                            name='expiration'
                            value='1d'
                            autoComplete='off'
                            onChange={() => setRadioIndex(2)}
                            checked={radioIndex === 2}
                          />
                        </Label>
                      </div>

                      <div>
                        <Label name='4 day'>
                          <Input
                            type='radio'
                            name='expiration'
                            value='4d'
                            autoComplete='off'
                            onChange={() => setRadioIndex(3)}
                            checked={radioIndex === 3}
                          />
                        </Label>
                      </div>

                      <div>
                        <Label name='1 week'>
                          <Input
                            type='radio'
                            name='expiration'
                            value='7d'
                            autoComplete='off'
                            onChange={() => setRadioIndex(4)}
                            checked={radioIndex === 4}
                          />
                        </Label>
                      </div>
                    </fieldset>

                    <div className={`${styles.grid} ${styles.gap_1}`}>
                      {(() => {
                        if (!actionData) {
                          return (
                            <Button
                              type='submit'
                              size='xs'
                              customStyles={`${styles.form__btn}`}
                              testId='btn__share__folder'
                              onClick={() =>
                                dispatch({
                                  field: 'folder',
                                  type: 'folder:share',
                                  value: {
                                    id: folder.id,
                                    on: true,
                                  },
                                })
                              }
                              isLoading={resourceActionIsLoading('folder:share', folder.id)}
                              disabled={resourceActionIsLoading('folder:share', folder.id)}
                            >
                              Share
                            </Button>
                          );
                        }
                        return (
                          <>
                            <Input
                              type='text'
                              name='generated_link'
                              value={actionData.url}
                              autoComplete='off'
                            />
                            <Button
                              type='button'
                              size='xs'
                              customStyles={`${styles.form__btn}`}
                              testId='btn__copy__link'
                              onClick={handleCopyToClipboard}
                            >
                              {copyToClipBoard ? 'Link copied to clipboard' : 'Copy Link'}
                            </Button>
                          </>
                        );
                      })()}
                    </div>
                  </Form>
                </div>
              </Modal>

              <div>
                <Form action={`/folders/${folder.id}`} method='POST' onSubmit={onSubmit}>
                  <Input type='hidden' name='intent' value='folder:delete' autoComplete='off' />
                  <Input type='hidden' name='folderId' value={`${folder.id}`} autoComplete='off' />
                  <Input
                    type='hidden'
                    name='parentId'
                    value={`${folder.parentId}`}
                    autoComplete='off'
                  />
                  <Button
                    type='submit'
                    size='lg'
                    customStyles={`${styles.background_none}  ${styles.del__btn}`}
                    testId='btn__delete__folder'
                    isLoading={resourceAction.folder['folder:delete'].on && isSubmitting}
                    disabled={resourceAction.folder['folder:delete'].on && isSubmitting}
                  >
                    Delete
                  </Button>
                </Form>
              </div>
            </>
          );
        })()}
      </div>
    </>
  );
}

ActionHeader.propTypes = {
  setFolders: PropTypes.func.isRequired,
  setFiles: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  resourceAction: PropTypes.shape({
    file: PropTypes.shape({
      'file:share': PropTypes.shape({
        id: PropTypes.number,
        on: PropTypes.bool.isRequired,
      }),
      'file:preview': PropTypes.shape({
        id: PropTypes.number,
        on: PropTypes.bool.isRequired,
      }),
      'file:download': PropTypes.shape({
        id: PropTypes.number,
        on: PropTypes.bool.isRequired,
      }),
      'file:delete': PropTypes.shape({
        id: PropTypes.number,
        on: PropTypes.bool.isRequired,
      }),
    }),
    folder: PropTypes.shape({
      'folder:share': PropTypes.shape({
        id: PropTypes.number,
        on: PropTypes.bool.isRequired,
      }),
      'folder:delete': PropTypes.shape({
        id: PropTypes.number,
        on: PropTypes.bool.isRequired,
      }),
    }),
  }),
};
