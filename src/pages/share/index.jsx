import { useState, Suspense, useEffect, useReducer, useMemo } from 'react';
import { useLoaderData, Await, useFetcher, useAsyncValue, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import Calendar from 'dayjs/plugin/calendar';
import helpers from '../../helpers';
import { reducer, reducerState } from './reducer';
import UserContext from '../../context/user.context';
import Header from '../../components/ui/header';
import SortHeader from './SortHeader';
import FileComponent from './File';
import FolderComponent from './Folder';
import FileModal from '../../components/ui/modal/FileModal';
import Spinner from '../../components/ui/spinner';
import Button from '../../components/ui/button';
import Link from '../../components/ui/link';
import styles from './css/index.module.css';

dayjs.extend(Calendar);

const { deepEqual, formatBytes } = helpers;

function Wrapper() {
  const [error, asyncData] = useAsyncValue();

  if (error) throw error;

  const fetcher = useFetcher();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
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
        formData.append('token', params.get('token'));

        fetcher.submit(formData, { action: '/share' });
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
    <div className={`${styles.app}`}>
      <Header />

      <div className={`${styles.main}`}>
        {resourceAction.file['file:preview'].on && (
          <div
            className={`${styles.grid} ${styles.grid__center} ${styles.gap_1} ${styles.preview}`}
          >
            {(() => {
              const isPreview = resourceAction.file['file:preview'].on;

              if (isLoading && isPreview) return <Spinner />;
              if (!isPreview) return null;

              const [e, apiData] = fetcher.data;

              if (e) throw e;

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

        <div>
          <div
            className={`${styles.flex} ${styles.gap_1} ${styles.flex__wrap} ${styles.margin_bottom_2rem}`}
          >
            {paths?.map((path, index) => {
              if (index !== paths.length - 1) {
                return (
                  <div
                    key={path.id}
                    className={`${styles.flex} ${styles.gap_1} ${styles.flex__wrap}`}
                  >
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
                <div
                  key={path.id}
                  className={`${styles.flex} ${styles.gap_1} ${styles.flex__wrap}`}
                >
                  <Link key={path.id} to={`/folders/${path.id}`} customStyles={`${styles.link}`}>
                    {path.name}
                  </Link>
                </div>
              );
            })}
          </div>

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
                      folders.map((folder) => <FolderComponent key={folder.id} folder={folder} />)}
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
                      </div>
                    </FileModal>
                  </div>
                );
              })}
            </>
          );
        })()}
      </div>
    </div>
  );
}

export default function Folder() {
  const { data, user } = useLoaderData();

  return (
    <UserContext.Provider value={user}>
      <Suspense fallback={<Spinner />}>
        <Await resolve={data}>
          <Wrapper />
        </Await>
      </Suspense>
    </UserContext.Provider>
  );
}
