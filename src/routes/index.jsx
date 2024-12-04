import { replace } from 'react-router-dom';
import App from '../pages/app';
import Register from '../pages/register';
import Login from '../pages/login';
import ErrorHandler from '../components/ui/error';
import loaders from '../loaders';
import actions from '../actions';

const { registerAction, loginAction, appAction } = actions;
const { appLoader, registerLoader, loaginLoader } = loaders;

const routes = [
  {
    path: '/',
    loader: appLoader.getUser,
    action: appAction,
    shouldRevalidate: () => false,
    element: <App />,
    errorElement: <ErrorHandler />,
  },
  {
    path: '/register',
    loader: registerLoader.checkAuth,
    action: registerAction.register,
    shouldRevalidate: () => false,
    element: <Register />,
    errorElement: <ErrorHandler />,
  },
  {
    path: '/login',
    loader: loaginLoader.checkAuth,
    action: loginAction.login,
    shouldRevalidate: () => false,
    element: <Login />,
    errorElement: <ErrorHandler />,
  },

  {
    path: '*',
    action: () => replace('/'),
    element: <ErrorHandler />,
  },
];

export default routes;
