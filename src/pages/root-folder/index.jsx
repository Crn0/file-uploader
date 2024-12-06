import { useState, Suspense, useEffect, useReducer } from 'react';
import { useLoaderData, Await, useFetcher } from 'react-router-dom';
import { reducer, reducerState } from './reducer';
import ActionHeader from './ActionHeader';
import FileComponent from './Files';
import FolderComponent from './Folder';
import Spinner from '../../components/ui/spinner';
import PreviewModal from '../../components/ui/modal/PreviewModal';
import Button from '../../components/ui/button';
import Input from '../../components/ui/form/Input';
import styles from './css/resource-form.module.css';

export default function RootFolder() {
  const { data } = useLoaderData();
  const fetcher = useFetcher();

  const [resourceAction, dispatch] = useReducer(reducer, reducerState);

  const [activeId, setActiveId] = useState(-1);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);

  const isLoading = fetcher.state === 'loading';
  const isSubmitting = fetcher.state === 'submitting';

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

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [resourceAction, isLoading, isSubmitting]);

  return (
    <Suspense fallback={<Spinner />}>
      <Await resolve={data}>
        {resourceAction && (
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
        {/* ACTION HEADER */}
        <div>
          <ActionHeader setFolders={setFolders} setFiles={setFiles} />
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
                    <PreviewModal
                      key={`${file.name} ${file.id}`}
                      title='File detail'
                      buttonText=':'
                      modalId={file.id}
                      activeId={activeId}
                      setActiveId={setActiveId}
                      buttonChildren={<FileComponent key={file.id} file={file} />}
                      dispatch={dispatch}
                      done={!resourceActionIsLoading('file:share', file.id)}
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
                          isLoading={resourceActionIsLoading('file:share', file.id)}
                          disabled={resourceActionIsLoading('file:share', file.id)}
                          onClick={handleFileAction(file.id, 'file:share')}
                          testId='btn__file__share'
                        >
                          Share
                        </Button>
                      </div>

                      {file.extension !== 'epub' && (
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
                      )}

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
                    </PreviewModal>
                  ))}
              </>
            );
          })()}
        </div>
        {/* PAGINATION */}
      </Await>
    </Suspense>
  );
}
