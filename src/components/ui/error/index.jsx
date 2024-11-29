import { Navigate, useRouteError } from 'react-router-dom';

export default function ErrorHandler() {
  const error = useRouteError();

  return (
    <>
      {(() => {
        if (!error) {
          return <Navigate to='/' replace />;
        }
        return (
          <div>
            <h2>Oops</h2>
            <p>Sorry, an unexpected error has occurred</p>
            <p>
              <i>{error?.httpCode || error?.code}</i>
              <i>{error?.statusText || error?.message}</i>
            </p>
          </div>
        );
      })()}
    </>
  );
}
