import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router';
import Spinner from '../../components/ui/spinner';
import SilentLogin from './SilentLogin';

export default function Loader() {
  const { data } = useLoaderData();

  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <Await resolve={data}>
          <SilentLogin />
        </Await>
      </Suspense>
    </div>
  );
}
