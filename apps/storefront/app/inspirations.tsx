'use client';

import { Carousel, StyledWrapper } from '@couture-next/ui';
import { useQuery } from '@tanstack/react-query';
import { Home, fetchFromCMS } from '../directus';
import { loader } from '../utils/next-image-directus-loader';
import { routes } from '@couture-next/routing';
import Link from 'next/link';

export function Inspirations() {
  const getInspirationsQuery = useQuery({
    queryKey: ['cms', 'home'],
    queryFn: () => fetchFromCMS<Home>('home', { fields: '*.*.*' }),
  });
  if (getInspirationsQuery.isError) throw getInspirationsQuery.error;

  if (getInspirationsQuery.isPending) {
    return null;
  }

  return (
    <StyledWrapper className="bg-light-100 mt-8 py-12">
      <h2 className="sr-only">Inspirations</h2>
      <Carousel
        loader={loader}
        images={getInspirationsQuery.data.inspirations.map((inspiration) => ({
          url: inspiration.image.filename_disk,
          alt: '',
        }))}
      />
      <Link className="btn-primary mx-auto mt-4" href={routes().shop().index()}>
        Voir la boutique
      </Link>
    </StyledWrapper>
  );
}
