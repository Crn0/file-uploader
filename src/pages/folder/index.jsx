import { useState, Suspense, useEffect, useReducer, Fragment } from 'react';
import { useLoaderData, Await, useFetcher } from 'react-router-dom';
import dayjs from 'dayjs';
import Calendar from 'dayjs/plugin/calendar';
import helpers from '../../helpers';
import { reducer, reducerState } from './reducer';
import ActionHeader from './ActionHeader';
import SortHeader from './SortHeader';
import FileComponent from './File';
import FolderComponent from './Folder';
import Spinner from '../../components/ui/spinner';
import FileModal from '../../components/ui/modal/FileModal';
import Button from '../../components/ui/button';
import Input from '../../components/ui/form/Input';
import Modal from '../../components/ui/modal';
import Label from '../../components/ui/form/Label';
import styles from './css/index.module.css';

dayjs.extend(Calendar);

const { deepEqual, formatBytes } = helpers;

export default function Folder() {
  const data = useLoaderData()?.data;
  const fetcher = useFetcher();
  const [resourceAction, dispatch] = useReducer(reducer, reducerState);

  const [activeId, setActiveId] = useState(-1);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [fetcherData, setFetcherData] = useState({ prev: undefined, data: null });
  const [radioIndex, setRadioIndex] = useState(null);
  const [copyToClipBoard, setCopyToClipBoard] = useState(false);

  const isLoading = fetcher.state === 'loading';
  const isSubmitting = fetcher.state === 'submitting';

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(fetcherData.data.url);
    setCopyToClipBoard(true);
  };

  const handleFileShare = (id) => {
    dispatch({
      field: 'file',
      type: 'file:share',
      value: {
        id,
        on: true,
      },
    });
  };

  const handleFileAction =
    (id, action, isSubmit = true) =>
    () => {
      if (isSubmit) {
        const formData = new FormData();
        formData.append('intent', action);
        formData.append('id', id);

        fetcher.submit(formData, { action: `/files/${id}` });
      }

      dispatch({
        field: 'file',
        type: action,
        value: {
          id,
          on: true,
        },
      });
    };

  const closePreview = () =>
    dispatch({
      field: 'file',
      type: 'file:preview',
      value: {
        id: null,
        on: false,
      },
    });

  const resourceActionIsLoading = (action, id, isForm = false) => {
    if (!isForm)
      return (
        isLoading === true &&
        resourceAction.file[action].on &&
        resourceAction.file[action].id === id
      );

    return (
      isSubmitting === true &&
      resourceAction.file[action].on &&
      resourceAction.file[action].id === id
    );
  };

  useEffect(() => {
    if (activeId) {
      document.body.style.overflowX = 'hidden';
    }

    if (!isLoading && resourceAction.file['file:preview'].on) {
      document.body.style.overflow = 'hidden';
    }

    if (!isSubmitting && resourceAction.file['file:delete'].on) {
      setFiles((prev) => {
        const { id } = resourceAction.file['file:delete'];

        return prev.filter((file) => file.id !== id);
      });

      dispatch({
        field: 'file',
        type: 'file:delete',
        value: {
          id: null,
          on: false,
        },
      });
    }

    if (fetcher.data && deepEqual(fetcher.data[1], fetcherData.prev) === false) {
      setFetcherData({ prev: fetcher.data[1], data: fetcher.data[1] });
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [resourceAction, isLoading, isSubmitting, fetcher.data, fetcherData.prev, activeId]);

  return (
    <Suspense fallback={<Spinner />}>
      <Await resolve={data}>
        <div className={`${styles.main}`}>
          {resourceAction.file['file:preview'].on && (
            <div
              className={`${styles.grid} ${styles.grid__center} ${styles.gap_1} ${styles.preview}`}
            >
              {(() => {
                const isPreview = resourceAction.file['file:preview'].on;

                if (isLoading && isPreview) return <Spinner />;
                if (!isPreview) return null;

                const [error, apiData] = fetcher.data;

                if (error) throw error;

                return (
                  <>
                    <div>
                      <div>
                        <Button
                          type='button'
                          size='xxs'
                          customStyles={`${styles.modal__btn}`}
                          testId='btn__preview__close'
                          onClick={closePreview}
                        >
                          X
                        </Button>
                      </div>
                    </div>

                    {apiData && (
                      <div className={`${styles.preview__image}`}>
                        <img src={apiData.url} alt={apiData.fileName} />
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
          {/* ACTION HEADER */}
          <div className={`${styles.grid} ${styles.gap_1}`}>
            <ActionHeader
              setFolders={setFolders}
              setFiles={setFiles}
              resourceAction={resourceAction}
              dispatch={dispatch}
            />
          </div>

          <div>
            <table className={`${styles.table}`}>
              <colgroup>
                <col span='1' className={`${styles.table__col__name}`} />
                <col span='1' />
                <col span='1' />
                <col span='1' />
              </colgroup>
              <SortHeader setFolders={setFolders} setFiles={setFiles} />

              {/* BODY */}
              <tbody>
                {(() => {
                  if (folders.length === 0 && files.length === 0)
                    return (
                      <tr>
                        <td colSpan='4' style={{ textAlign: 'center' }}>
                          Empty folder
                        </td>
                      </tr>
                    );

                  return (
                    <>
                      {folders.length !== 0 &&
                        folders.map((folder) => (
                          <FolderComponent key={folder.id} folder={folder} />
                        ))}
                      {files.length !== 0 &&
                        files.map((file) => (
                          <FileComponent key={file.id} file={file} setActiveId={setActiveId} />
                        ))}
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>

          {(() => {
            if (files.length === 0) return null;

            return (
              <>
                {files.map((file) => {
                  if (file.id !== activeId) return null;

                  return (
                    <div key={file.id} className={`${styles.file__info__modal__container}`}>
                      <FileModal
                        key={`${file.name} ${file.id}`}
                        title='File detail'
                        buttonText=':'
                        modalCustomStyles={`${styles.dialog}  ${styles.file__info__modal}`}
                        modalCloseButtonCustomStyles={`${styles.modal__btn}`}
                        modalId={file.id}
                        activeId={activeId}
                        setActiveId={setActiveId}
                        on={resourceAction.file['file:preview'].on}
                        done={!resourceActionIsLoading('file:preview', file.id)}
                        cleanUp={setCopyToClipBoard}
                        hasButton={false}
                        hasChildModal={resourceAction.file['file:share'].id === file.id}
                        isTable
                      >
                        <div className={`${styles.margin_bottom_hundred_percent}`}>
                          {(() => {
                            const validFields = {
                              name: 'Name',
                              size: 'Size',
                              createdAt: 'Created',
                              type: 'Type',
                              extension: 'Extension',
                            };

                            const entries = Object.entries(file);

                            return (
                              <>
                                {entries.map(([key, _]) => {
                                  if (!validFields[key]) return null;

                                  return (
                                    <div
                                      key={`${file.id} ${key}`}
                                      className={styles.margin_bottom_8px}
                                    >
                                      <div>
                                        {(() => {
                                          if (key === 'size') {
                                            return (
                                              <>
                                                <div className={`${styles.bold}`}>
                                                  {validFields[key]}
                                                </div>
                                                <div>{formatBytes(file[key])}</div>
                                              </>
                                            );
                                          }

                                          if (key === 'createdAt') {
                                            return (
                                              <>
                                                <div className={`${styles.bold}`}>
                                                  {validFields[key]}
                                                </div>
                                                <div>{dayjs().calendar(dayjs(file[key]))}</div>
                                              </>
                                            );
                                          }
                                          return (
                                            <>
                                              <div className={`${styles.bold}`}>
                                                {validFields[key]}
                                              </div>
                                              <div>{file[key]}</div>
                                            </>
                                          );
                                        })()}
                                      </div>
                                    </div>
                                  );
                                })}
                              </>
                            );
                          })()}
                        </div>

                        <div className={`${styles.file__info__modal__middle}`}>
                          <div>
                            <Button
                              type='submit'
                              size='xs'
                              onClick={() => handleFileShare(file.id)}
                              testId='btn__file__share'
                              customStyles={`${styles.action__btn}`}
                            >
                              Share
                            </Button>
                          </div>

                          {(() => {
                            if (file.extension === 'epub') return null;

                            return (
                              <div>
                                <Button
                                  type='submit'
                                  size='xs'
                                  isLoading={resourceActionIsLoading('file:preview', file.id)}
                                  disabled={resourceActionIsLoading('file:preview', file.id)}
                                  onClick={handleFileAction(file.id, 'file:preview')}
                                  testId='btn__file__preview'
                                  customStyles={`${styles.action__btn}`}
                                >
                                  Preview
                                </Button>
                              </div>
                            );
                          })()}

                          <div>
                            <Button
                              type='submit'
                              size='xs'
                              isLoading={resourceActionIsLoading('file:download')}
                              disabled={resourceActionIsLoading('file:download')}
                              onClick={handleFileAction(file.id, 'file:download')}
                              testId='btn__file__download'
                              customStyles={`${styles.action__btn}`}
                            >
                              Download
                            </Button>
                          </div>

                          <div>
                            <fetcher.Form action={`/files/${file.id}`} method='DELETE'>
                              <Input
                                type='hidden'
                                name='intent'
                                value='file:delete'
                                autoComplete='off'
                              />

                              <Input
                                type='hidden'
                                name='fileId'
                                value={String(file.id)}
                                autoComplete='off'
                              />
                              <Button
                                type='submit'
                                size='xs'
                                onClick={handleFileAction(file.id, 'file:delete', false)}
                                isLoading={resourceActionIsLoading('file:delete', file.id, true)}
                                disabled={resourceActionIsLoading('file:delete', file.id, true)}
                                testId='btn__file__delete'
                                customStyles={`${styles.del__btn}`}
                              >
                                Delete
                              </Button>
                            </fetcher.Form>
                          </div>
                        </div>
                      </FileModal>
                    </div>
                  );
                })}
              </>
            );
          })()}

          {files.map((file) => (
            <Fragment key={file.id}>
              {(() => {
                if (resourceAction.file['file:share'].id !== file.id) return null;
                return (
                  <Modal
                    title='Share Link'
                    buttonText='Share Link'
                    needButton={false}
                    shouldOpen={resourceAction.file['file:share'].id === file.id}
                    cleanup={() => {
                      setFetcherData((prev) => ({ ...prev, data: null }));
                      dispatch({
                        field: 'file',
                        type: 'file:share',
                        value: {
                          id: null,
                          on: false,
                        },
                      });
                    }}
                    dialogContainerCustomStyles={`${styles.share__modal__container} ${styles.pos_absolute}`}
                    dialogCustomStyles={`${styles.dialog}  ${styles.width_50per}`}
                    dialogTopCustomStyles={`${styles.flex} ${styles.space_between}`}
                    modalButtonContainerCustomStyles={`${styles.modal__btn__container}`}
                    modalCloseButtonCustomStyles={`${styles.modal__btn}`}
                  >
                    <fetcher.Form
                      action={`/files/${resourceAction.file['file:share'].id}`}
                      method='POST'
                      className={`${styles.share__form}`}
                    >
                      <Input type='hidden' name='intent' value='file:share' autoComplete='off' />
                      <Input
                        type='hidden'
                        name='fileId'
                        value={String(resourceAction.file['file:share'].id)}
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
                              isDisabled={fetcherData.data !== null}
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
                              isDisabled={fetcherData.data !== null}
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
                              isDisabled={fetcherData.data !== null}
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
                              isDisabled={fetcherData.data !== null}
                            />
                          </Label>
                        </div>
                      </fieldset>

                      <div className={`${styles.grid} ${styles.gap_1}`}>
                        {(() => {
                          if (!fetcherData.data) {
                            return (
                              <Button
                                type='submit'
                                size='m'
                                customStyles={`${styles.action__btn}`}
                                testId='btn__share__file'
                                onClick={() =>
                                  dispatch({
                                    field: 'file',
                                    type: 'file:share',
                                    value: {
                                      id: resourceAction.file['file:share'].id,
                                      on: true,
                                    },
                                  })
                                }
                                isLoading={resourceActionIsLoading(
                                  'folder:file',
                                  resourceAction.file['file:share'].id,
                                )}
                                disabled={resourceActionIsLoading(
                                  'folder:file',
                                  resourceAction.file['file:share'].id,
                                )}
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
                                value={fetcherData.data.url}
                                autoComplete='off'
                              />
                              <Button
                                type='button'
                                size='m'
                                customStyles={`${styles.action__btn}`}
                                testId='btn__copy__link'
                                onClick={handleCopyToClipboard}
                              >
                                {copyToClipBoard ? 'Link copied to clipboard' : 'Copy Link'}
                              </Button>
                            </>
                          );
                        })()}
                      </div>
                    </fetcher.Form>
                  </Modal>
                );
              })()}
            </Fragment>
          ))}
        </div>
      </Await>
    </Suspense>
  );
}
