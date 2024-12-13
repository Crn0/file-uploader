import { useState, Suspense, useEffect, useReducer } from 'react';
import { useLoaderData, Await, useFetcher } from 'react-router-dom';
import { reducer, reducerState } from './reducer';
import ActionHeader from './ActionHeader';
import SortHeader from './SortHeader';
import FileComponent from './File';
import FolderComponent from './Folder';
import Label from '../../components/ui/form/Label';
import Input from '../../components/ui/form/Input';
import FileModal from '../../components/ui/modal/FileModal';
import Modal from '../../components/ui/modal';
import Spinner from '../../components/ui/spinner';
import Button from '../../components/ui/button';
import styles from './css/resource-form.module.css';

function deepEqual(x, y) {
  const ok = Object.keys;
  const tx = typeof x;
  const ty = typeof y;
  return x && y && tx === 'object' && tx === ty
    ? ok(x).length === ok(y).length && ok(x).every((key) => deepEqual(x[key], y[key]))
    : x === y;
}

export default function Folder() {
  const { data } = useLoaderData();
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

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(fetcherData.url);
    setCopyToClipBoard(true);
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
  }, [resourceAction, isLoading, isSubmitting, fetcher.data, fetcherData.prev]);

  return (
    <Suspense fallback={<Spinner />}>
      <Await resolve={data}>
        {resourceAction.file['file:preview'].on && (
          <div>
            {(() => {
              const isPreview = resourceAction.file['file:preview'].on;

              if (isLoading && isPreview) return <Spinner />;
              if (!isPreview) return null;

              const [error, apiData] = fetcher.data;

              if (error) throw error;

              return (
                <div>
                  <div>
                    <div>{apiData?.fileName}</div>
                    <div>
                      <Button type='button' size='xxs' onClick={closePreview}>
                        X
                      </Button>
                    </div>
                  </div>

                  {apiData && (
                    <div style={{ width: '500px' }}>
                      <img src={apiData.url} alt={apiData.fileName} />
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
        <div>
          {/* ACTION HEADER */}
          <div>
            <ActionHeader
              setFolders={setFolders}
              setFiles={setFiles}
              resourceAction={resourceAction}
              dispatch={dispatch}
            />
          </div>

          <div>
            <SortHeader setFolders={setFolders} setFiles={setFiles} />
          </div>
          {/* BODY */}
          <div>
            {(() => {
              if (folders.length === 0 && files.length === 0) return <p>Empty folder</p>;

              return (
                <>
                  {folders.length !== 0 &&
                    folders.map((folder) => <FolderComponent key={folder.id} folder={folder} />)}
                  {files.length !== 0 &&
                    files.map((file) => (
                      <FileModal
                        key={`${file.name} ${file.id}`}
                        title='File detail'
                        buttonText=':'
                        modalId={file.id}
                        activeId={activeId}
                        setActiveId={setActiveId}
                        buttonChildren={<FileComponent key={file.id} file={file} />}
                        dispatch={dispatch}
                        done={!resourceActionIsLoading('file:preview', file.id)}
                        on={resourceAction.file['file:preview'].on}
                      >
                        <div>
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
                                    <div key={`${file.id} ${key}`}>
                                      <div>
                                        <span>{validFields[key]}</span>
                                        <div>
                                          <span>{file[key]}</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </>
                            );
                          })()}
                        </div>

                        <div>
                          <Button
                            type='submit'
                            size='xs'
                            onClick={() => handleFileShare(file.id)}
                            testId='btn__file__share'
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
                            >
                              Delete
                            </Button>
                          </fetcher.Form>
                        </div>

                        {(() => {
                          if (resourceAction.file['file:share'].id !== file.id) return null;
                          return (
                            <div>
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
                              >
                                <fetcher.Form
                                  action={`/files/${resourceAction.file['file:share'].id}`}
                                  method='POST'
                                >
                                  <Input
                                    type='hidden'
                                    name='intent'
                                    value='file:share'
                                    autoComplete='off'
                                  />
                                  <Input
                                    type='hidden'
                                    name='fileId'
                                    value={resourceAction.file['file:share'].id}
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

                                  <div>
                                    {(() => {
                                      if (!fetcherData.data) {
                                        return (
                                          <Button
                                            type='submit'
                                            size='lg'
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
                                            size='xs'
                                            testId='btn__copy__link'
                                            onClick={handleCopyToClipboard}
                                          >
                                            {copyToClipBoard
                                              ? 'Link copied to clipboard'
                                              : 'Copy Link'}
                                          </Button>
                                        </>
                                      );
                                    })()}
                                  </div>
                                </fetcher.Form>
                              </Modal>
                            </div>
                          );
                        })()}
                      </FileModal>
                    ))}
                </>
              );
            })()}
          </div>

          {/* PAGINATION */}
        </div>
      </Await>
    </Suspense>
  );
}
