import { Navigate, useRouteError } from 'react-router-dom';
import styles from './css/index.module.css';

export default function ErrorHandler() {
  const error = useRouteError();

  return (
    <>
      {(() => {
        if (!error) {
          return <Navigate to='/' replace />;
        }
        return (
          <div className={`${styles.grid} ${styles.content_center} ${styles.margin_top_25rem}`}>
            <div>
              <span className={`${styles.h2}`}>Oops</span>
            </div>
            <div className={`${styles.grid} ${styles.gap_1rem}`}>
              <p>Sorry, an unexpected error has occurred</p>
              <p>
                <i>{error?.httpCode || error?.code}</i>
                <i>{error?.statusText || error?.message}</i>
              </p>
            </div>
          </div>
        );
      })()}
    </>
  );
}
