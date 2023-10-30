import { routes } from '@couture-next/routing';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <h1 className="text-3xl font-serif text-center mb-8">Administration</h1>
      <ul className="border rounded-md shadow-md mx-auto max-w-md w-full">
        <li className="border-b py-4">
          <Link
            className="px-8 block"
            href={routes().admin().products().index()}
          >
            Créations
          </Link>
        </li>
        <li className="border-b py-4">
          <Link
            className="px-8 block"
            href={routes().admin().fabrics().index()}
          >
            Tissus
          </Link>
        </li>
      </ul>
    </>
  );
}
