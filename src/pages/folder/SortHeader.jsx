import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useAsyncValue, useFetcher } from 'react-router-dom';
import Button from '../../components/ui/button';
import styles from './css/sort-header.module.css';

export default function SortHeader({ setFolders, setFiles }) {
  const [error, asyncData] = useAsyncValue();

  if (error) throw error;

  const fetcher = useFetcher();
  const [sort, setSort] = useState('ASC');
  const folder = asyncData.data?.folder;

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
    if (fetcher.data?.[1]) {
      const { data } = fetcher.data[1];

      setFolders(data.folder.folders);
      setFiles(data.folder.files);
    }
  }, [fetcher.data, folder.files, folder.folders, setFiles, setFolders]);

  return (
    <thead>
      <tr>
        <th scope='col' id='name'>
          <Button type='button' na size='lg' onClick={sortName}>
            Name
          </Button>
        </th>
        <th scope='col' id='type'>
          <Button type='button' na size='lg'>
            Type
          </Button>
        </th>
        <th scope='col' id='size'>
          <Button type='button' na size='lg'>
            Size
          </Button>
        </th>

        <th scope='col' id='creation_date'>
          <Button type='button' na size='lg' onClick={sortDate}>
            Creation Date
          </Button>
        </th>
      </tr>
    </thead>
  );
}

SortHeader.propTypes = {
  setFolders: PropTypes.func.isRequired,
  setFiles: PropTypes.func.isRequired,
};
