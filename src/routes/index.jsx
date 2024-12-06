import { replace } from 'react-router-dom';
import App from '../pages/app';
import Register from '../pages/register';
import Login from '../pages/login';
import RootFolder from '../pages/root-folder/index';
import ErrorHandler from '../components/ui/error';
import loaders from '../loaders';
import actions from '../actions';

const { registerAction, loginAction, appAction, rootFolderAction, fileAction } = actions;
const { appLoader, registerLoader, loaginLoader, rootFolderLoader, fileLoader } = loaders;

const routes = [
  {
    path: '/',
    loader: appLoader.getUser,
    action: appAction,
    shouldRevalidate: () => false,
    element: <App />,
    errorElement: <ErrorHandler />,
    children: [
      {
        index: true,
        loader: rootFolderLoader.getRootFolder,
        shouldRevalidate: () => false,
        element: <RootFolder />,
      },
      {
        path: '/root-folder',
        action: rootFolderAction,
        loader: rootFolderLoader.getRootFolder,
        element: <RootFolder />,
        shouldRevalidate: () => false,
        errorElement: <ErrorHandler />,
      },
      {
        path: 'files/:fieldId',
        loader: fileLoader,
        action: fileAction,
        shouldRevalidate: () => false,
        errorElement: <ErrorHandler />,
      },
    ],
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
