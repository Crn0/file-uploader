import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useAsyncValue, useFetcher, useLocation } from 'react-router-dom';
import Button from '../../components/ui/button';
import styles from './css/sort-header.module.css';

export default function SortHeader({ setFolders, setFiles }) {
  const [
    _,
    {
      data: { folder },
    },
  ] = useAsyncValue();

  const fetcher = useFetcher();
  const [sort, setSort] = useState('ASC');
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const sortName = () => {
    const formData = new FormData();
    const sortBy = sort === 'ASC' ? 'name' : '-name';

    formData.append('token', params.get('token'));
    formData.append('intent', 'folder:sort');
    formData.append('id', folder.id);
    formData.append('sort', sortBy);

    fetcher.submit(formData, { action: '/share' });
    setSort((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
  };

  const sortDate = () => {
    const formData = new FormData();
    const sortBy = sort === 'ASC' ? 'createdAt' : '-createdAt';

    formData.append('token', params.get('token'));
    formData.append('intent', 'folder:sort');
    formData.append('id', folder.id);
    formData.append('sort', sortBy);

    fetcher.submit(formData, { action: '/share' });
    setSort((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
  };

  useEffect(() => {
    if (fetcher.data?.[1]) {
      const { data } = fetcher.data[1];

      setFolders(data.folder.folders);
      setFiles(data.folder.files);
    }
  }, [fetcher.data, folder.files, folder.folders, setFiles, setFolders]);

  return (
    <>
      <div>
        <Button type='button' na size='lg' onClick={sortName}>
          Name
        </Button>
      </div>
      <div>
        <Button type='button' na size='lg'>
          Type
        </Button>
      </div>
      <div>
        <Button type='button' na size='lg'>
          Size
        </Button>
      </div>

      <div>
        <Button type='button' na size='lg' onClick={sortDate}>
          Creation Date
        </Button>
      </div>
    </>
  );
}

SortHeader.propTypes = {
  setFolders: PropTypes.func.isRequired,
  setFiles: PropTypes.func.isRequired,
};
