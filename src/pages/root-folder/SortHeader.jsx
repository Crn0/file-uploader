import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useAsyncValue, useFetcher } from 'react-router-dom';
import { FaCaretUp } from 'react-icons/fa';
import { FaCaretDown } from 'react-icons/fa';
import Button from '../../components/ui/button';
import styles from './css/sort-header.module.css';

export default function SortHeader({ setFolders, setFiles }) {
  const [error, asyncData] = useAsyncValue();
  const [activeSortIndex, setActivceSortIndex] = useState(0);

  if (error) throw error;

  const fetcher = useFetcher();
  const [sort, setSort] = useState('ASC');
  const folder = asyncData.data?.folder;

  const sortName = () => {
    const formData = new FormData();
    const sortBy = sort !== 'ASC' ? 'name' : '-name';

    formData.append('intent', 'folder:sort');
    formData.append('id', folder.id);
    formData.append('sort', sortBy);

    fetcher.submit(formData, { action: `/folders/${folder.id}` });
    setSort((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
    setActivceSortIndex(0);
  };

  const sortDate = () => {
    const formData = new FormData();
    const sortBy = sort !== 'ASC' ? 'createdAt' : '-createdAt';

    formData.append('intent', 'folder:sort');
    formData.append('id', folder.id);
    formData.append('sort', sortBy);

    fetcher.submit(formData, { action: `/folders/${folder.id}` });
    setSort((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
    setActivceSortIndex(1);
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
        <th scope='col' id='name' className={`${styles.th}`}>
          <Button type='button' na size='lg' onClick={sortName} customStyles={`${styles.btn}`}>
            <div className={`${styles.flex} ${styles.gap_1}`}>
              Name
              {(() => {
                if (activeSortIndex !== 0) return null;

                return sort === 'ASC' ? <FaCaretUp /> : <FaCaretDown />;
              })()}
            </div>
          </Button>
        </th>
        <th scope='col' id='type' className={`${styles.th}`}>
          <Button type='button' na size='lg' customStyles={`${styles.btn}`}>
            <div>Type</div>
          </Button>
        </th>
        <th scope='col' id='size' className={`${styles.th}`}>
          <Button type='button' na size='lg' customStyles={`${styles.btn}`}>
            <div>Size</div>
          </Button>
        </th>

        <th scope='col' id='creation_date' className={`${styles.th}`}>
          <Button
            type='button'
            na
            size='lg'
            onClick={sortDate}
            customStyles={`${styles.btn} ${styles.flex} ${styles.flex__center}`}
          >
            <div className={`${styles.flex} ${styles.gap_1}`}>
              Creation Date
              {(() => {
                if (activeSortIndex !== 1) return null;

                return sort === 'ASC' ? <FaCaretUp /> : <FaCaretDown />;
              })()}
            </div>
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
