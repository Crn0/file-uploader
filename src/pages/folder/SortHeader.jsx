import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useAsyncValue, useFetcher } from 'react-router-dom';
import Button from '../../components/ui/button';
import styles from './css/action-header.module.css';

export default function SortHeader({ setFolders, setFiles }) {
  const [
    _,
    {
      data: { folder },
    },
  ] = useAsyncValue();

  const fetcher = useFetcher();
  const [sort, setSort] = useState('ASC');

  const sortName = () => {
    const formData = new FormData();
    const sortBy = sort === 'ASC' ? 'name' : '-name';

    formData.append('intent', 'folder:sort');
    formData.append('id', folder.id);
    formData.append('sort', sortBy);

    fetcher.submit(formData, { action: `/folders/${folder.id}` });
    setSort((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
  };

  const sortDate = () => {
    const formData = new FormData();
    const sortBy = sort === 'ASC' ? 'createdAt' : '-createdAt';

    formData.append('intent', 'folder:sort');
    formData.append('id', folder.id);
    formData.append('sort', sortBy);

    fetcher.submit(formData, { action: `/folders/${folder.id}` });
    setSort((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
  };

  useEffect(() => {
    if (fetcher.data) {
      setFolders(folder.folders);
      setFiles(folder.files);
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
