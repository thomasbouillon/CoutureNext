'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import useDatabase from '../../../hooks/useDatabase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { firestoreOrderConverter } from '@couture-next/utils';
import { routes } from '@couture-next/routing';
import Image from 'next/image';
import { loader } from '../../../utils/next-image-firebase-storage-loader';

export default function Page() {
  const db = useDatabase();
  const { user } = useAuth();
  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: () => {
      return getDocs(
        query(
          collection(db, 'orders').withConverter(firestoreOrderConverter),
          where('user.uid', '==', user?.uid ?? 'will-not-beused')
        )
      ).then((snapshot) => snapshot.docs.map((doc) => doc.data()));
    },
    enabled: !!user,
  });

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-serif text-center mb-8">Mes commandes</h1>
      <div className="flex flex-col items-center">
        {ordersQuery.data?.map((order) => (
          <div key={order._id} className="border rounded-sm p-4">
            <Link
              href={routes().account().orders().order(order._id)}
              className="btn-light mx-auto underline"
            >
              {order.createdAt.toLocaleDateString()}
            </Link>
            <div>
              {order.items.map((item, i) => (
                <div key={i}>
                  <Image
                    src={item.image}
                    width={256}
                    height={256}
                    loader={loader}
                    className="w-64 h-64 mx-auto object-contain object-center"
                    alt=""
                  />
                  <p className="text-center">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}