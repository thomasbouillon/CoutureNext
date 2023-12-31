import { Article } from '@couture-next/types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestoreConverterAddRemoveId } from '@couture-next/utils';
import { firestore } from '../../../../hooks/useDatabase';
import { cache } from 'react';
import { firebaseServerImageLoader as loader } from '@couture-next/utils';
import { notFound } from 'next/navigation';
import ArticleSection from './ArticleSection';
import SimilarArticlesSection from './SimilarArticlesSection';
import CustomArticleSection from './CustomArticleSection';
import ReviewsSection from './ReviewsSections';
import { Metadata } from 'next';
import { WithStructuedDataWrapper } from '@couture-next/ui';
import { routes } from '@couture-next/routing';
import { structuredData } from '@couture-next/seo';

type Props = {
  params: {
    articleSlug: string;
    inStockSlug: string;
  };
};

export const generateMetadata = async ({ params: { articleSlug, inStockSlug } }: Props) => {
  const article = await cachedArticleBySlugFn(articleSlug);
  const stockIndex = article.stocks.findIndex((stock) => stock.slug === inStockSlug);

  return {
    title: article.stocks[stockIndex].title,
    description: article.stocks[stockIndex].seo.description,
    openGraph: {
      locale: 'fr_FR',
      url: routes().shop().article(articleSlug).showInStock(inStockSlug),
      siteName: 'Petit Roudoudou',
      title: article.stocks[stockIndex].title,
      description: article.stocks[stockIndex].seo.description,
      images: article.stocks[stockIndex].images.map((image) =>
        loader({
          src: image.url,
          width: 512,
        })
      ),
    },
  } satisfies Metadata;
};

export default async function Page({ params: { articleSlug, inStockSlug } }: Props) {
  const article = await cachedArticleBySlugFn(articleSlug);
  const stockIndex = article.stocks.findIndex((stock) => stock.slug === inStockSlug);

  if (stockIndex < 0) return notFound();
  if (article.stocks.length < stockIndex) throw new Error('Stock index out of range');

  return (
    <WithStructuedDataWrapper stucturedData={structuredData.inStockArticle(article, stockIndex)} as="div">
      <ArticleSection article={article} stockIndex={stockIndex} />
      <SimilarArticlesSection article={article} stockIndex={stockIndex} />
      <ReviewsSection articleId={article._id} />
      <CustomArticleSection article={article} stockIndex={stockIndex} />
    </WithStructuedDataWrapper>
  );
}

const cachedArticleBySlugFn = cache(async (slug: string) => {
  const snapshot = await getDocs(
    query(collection(firestore, 'articles'), where('slug', '==', slug)).withConverter(
      firestoreConverterAddRemoveId<Article>()
    )
  );
  if (snapshot.empty) throw Error('Not found');
  const article = snapshot.docs[0].data();
  return article;
});
