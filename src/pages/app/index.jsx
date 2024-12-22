import { Outlet, useLoaderData } from 'react-router-dom';
import UserContext from '../../context/user.context';
import Header from '../../components/ui/header';
import styles from './css/index.module.css';

function App() {
  const data = useLoaderData();

  return (
    <UserContext.Provider value={data}>
      <div className={`${styles.app}`}>
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </UserContext.Provider>
  );
}

export default App;
