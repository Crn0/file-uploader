import { useState, Suspense, useEffect, useReducer, useMemo } from 'react';
import { useLoaderData, Await, useFetcher, useAsyncValue, useLocation } from 'react-router-dom';
import { reducer, reducerState } from './reducer';
import Header from '../../components/ui/header';
import SortHeader from './SortHeader';
import FileComponent from './File';
import FolderComponent from './Folder';
import FileModal from '../../components/ui/modal/FileModal';
import Spinner from '../../components/ui/spinner';
import Button from '../../components/ui/button';
import Link from '../../components/ui/link';
import styles from './css/index.module.css';

function deepEqual(x, y) {
  const ok = Object.keys;
  const tx = typeof x;
  const ty = typeof y;
  return x && y && tx === 'object' && tx === ty
    ? ok(x).length === ok(y).length && ok(x).every((key) => deepEqual(x[key], y[key]))
    : x === y;
}

function Wrapper() {
  const [error, asyncData] = useAsyncValue();

  if (error) throw error;

  const fetcher = useFetcher();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  console.log(fetcher.data);
  const [resourceAction, dispatch] = useReducer(reducer, reducerState);

  const [activeId, setActiveId] = useState(-1);
  const paths = useMemo(() => asyncData.path, [asyncData]);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [fetcherData, setFetcherData] = useState({ prev: undefined, data: null });

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
    if (asyncData) {
      const { data } = asyncData;
      setFolders(data.folder.folders);
      setFiles(data.folder.files);
    }

    if (!isLoading && resourceAction.file['file:preview'].on) {
      document.body.style.overflow = 'hidden';
    }

    if (fetcher.data && deepEqual(fetcher.data[1], fetcherData.prev) === false) {
      setFetcherData({ prev: fetcher.data[1], data: fetcher.data[1] });
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [resourceAction, isLoading, isSubmitting, fetcher.data, fetcherData.prev, asyncData]);

  return (
    <>
      <Header />

      <div>
        {paths?.map((path, index) => {
          if (index === 0) {
            return (
              <div key={path.id}>
                <div>
                  <div>
                    <Link to={`${location.pathname}?token=${params.get('token')}`}>
                      <span>{path.name}</span>
                    </Link>
                  </div>

                  {index !== paths.length - 1 && (
                    <div>
                      <span> {'>'} </span>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div key={path.id}>
              <div>
                <Link
                  key={path.id}
                  to={`${location.pathname}?token=${params.get('token')}&folderId=${path.id}&type=sub-folder`}
                >
                  {path.name}
                </Link>

                {index !== paths.length - 1 && (
                  <div>
                    <span> {'>'} </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {resourceAction.file['file:preview'].on && (
        <div>
          {(() => {
            const isPreview = resourceAction.file['file:preview'].on;

            if (isLoading && isPreview) return <Spinner />;
            if (!isPreview) return null;

            const [e, apiData] = fetcher.data;

            if (e) throw e;

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
                  folders.map((f) => (
                    <FolderComponent
                      key={f.id}
                      folder={f}
                      url={`${location.pathname}?token=${params.get('token')}`}
                    />
                  ))}
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
                    </FileModal>
                  ))}
              </>
            );
          })()}
        </div>
      </div>
    </>
  );
}

export default function Folder() {
  const { data } = useLoaderData();

  return (
    <Suspense fallback={<Spinner />}>
      <Await resolve={data}>
        <Wrapper />
      </Await>
    </Suspense>
  );
}
