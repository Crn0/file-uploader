import { Outlet, useLoaderData } from 'react-router-dom';
import UserContext from '../../context/user.context';
import Header from '../../components/ui/header';

function App() {
  const data = useLoaderData();

  return (
    <UserContext.Provider value={data}>
      <Header />
      <main>
        <Outlet />
      </main>
    </UserContext.Provider>
  );
}

export default App;
