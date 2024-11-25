import App from '../pages/app';
import Register from '../pages/register';
import Login from '../pages/login';
import loaders from '../loaders';
import actions from '../actions';

const { registerAction, loginAction } = actions;

const routes = [
  {
    path: '/',
    loader: loaders.appLoader.getUser,
    element: <App />,
  },
  {
    path: '/register',
    action: registerAction.register,
    element: <Register />,
  },
  {
    path: '/login',
    action: loginAction.login,
    element: <Login />,
  },
];

export default routes;
