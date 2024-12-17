import { replace } from 'react-router-dom';
import App from '../pages/app';
import Register from '../pages/register';
import Login from '../pages/login';
import RootFolder from '../pages/root-folder/index';
import Folder from '../pages/folder/index';
import Share from '../pages/share';
import ErrorHandler from '../components/ui/error';
import loaders from '../loaders';
import actions from '../actions';

const {
  appLoader,
  registerLoader,
  loaginLoader,
  rootFolderLoader,
  fileLoader,
  folderLoader,
  shareLoader,
} = loaders;
const { registerAction, loginAction, appAction, rootFolderAction, fileAction, folderAction } =
  actions;

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
        loader: rootFolderLoader,
        shouldRevalidate: () => false,
        element: <RootFolder />,
      },
      {
        path: 'root-folder',
        action: rootFolderAction,
        loader: rootFolderLoader,
        element: <RootFolder />,
        shouldRevalidate: () => false,
        errorElement: <ErrorHandler />,
      },
      {
        path: 'folders/:folderId',
        loader: folderLoader,
        action: folderAction,
        element: <Folder />,
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
    path: '/share',
    loader: shareLoader,
    action: fileAction,
    element: <Share />,
    errorElement: <ErrorHandler />,
  },
  {
    path: '*',
    action: () => replace('/'),
    element: <ErrorHandler />,
  },
];

export default routes;
