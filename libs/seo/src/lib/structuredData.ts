import { Article, Review } from '@couture-next/types';
import { firebaseServerImageLoader as loader } from '@couture-next/utils';
import { Organization, Product, ProductGroup, UserReview } from 'schema-dts';

export function customizableArticle(article: Article): ProductGroup {
  return {
    '@type': 'ProductGroup',
    '@id': article._id,
    productGroupID: article._id,
    name: article.name,
    description: article.seo.description,
    image: loader({
      src: article.images[0].url,
      width: 512,
    }),
    countryOfAssembly: 'FR',
    countryOfLastProcessing: 'FR',
    countryOfOrigin: 'FR',
    isFamilyFriendly: true,
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: Math.min(...article.skus.map((sku) => sku.price)),
      highPrice: Math.max(...article.skus.map((sku) => sku.price)),
      priceCurrency: 'EUR',
    },
    hasVariant: article.skus.map((sku) => ({
      '@type': 'Product',
      '@id': article._id + '-' + sku.uid,
    })),
    variesBy: Object.values(article.characteristics).map((characteristic) => characteristic.label),
    review: article.reviewIds.map((id) => ({
      '@type': 'Review',
      '@id': id,
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: article.aggregatedRating,
      reviewCount: article.reviewIds.length,
      bestRating: 5,
    },
  };
}

export function inStockArticle(article: Article, stockIndex: number): Product {
  const sku = article.skus.find((sku) => sku.uid === article.stocks[stockIndex].sku);

  const r: Product = {
    '@type': 'Product',
    '@id': article._id + '-' + article.stocks[stockIndex].uid,
    name: article.stocks[stockIndex].title,
    description: article.stocks[stockIndex].seo.description,
    image: loader({
      src: article.stocks[stockIndex].images[0].url,
      width: 512,
    }),
    material: sku?.composition,
    countryOfAssembly: 'FR',
    countryOfLastProcessing: 'FR',
    countryOfOrigin: 'FR',
    isFamilyFriendly: true,
    offers: {
      '@type': 'Offer',
      price: article.skus.find((sku) => sku.uid === article.stocks[stockIndex].sku)?.price ?? 0,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(new Date().getTime() + 31536000000).toISOString(),
      // sku
    },
    isVariantOf: {
      '@type': 'ProductGroup',
      '@id': article._id,
    },
    review: article.reviewIds.map((id) => ({
      '@type': 'Review',
      '@id': id,
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: article.aggregatedRating,
      reviewCount: article.reviewIds.length,
      bestRating: 5,
    },
  };

  const [sizeOptionUid] = Object.entries(article.characteristics).find(([_, value]) => {
    return value.label.toLowerCase() === 'taille';
  }) ?? [null, null];

  if (sizeOptionUid) {
    const sku = article.skus.find((sku) => sku.uid === article.stocks[stockIndex].sku);
    const skuSizeUid = sku?.characteristics[sizeOptionUid];
    const sizeLabel = skuSizeUid ? article.characteristics[sizeOptionUid].values[skuSizeUid] : null;
    if (sizeLabel) {
      r.size = sizeLabel;
    }
  }

  if (!r.size) {
    r.size = 'Taille unique';
  }

  return r;
}

export function organization(BASE_URL: string): Organization {
  return {
    '@type': 'Organization',
    name: 'Petit Roudoudou',
    sameAs: [],
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/images/logo.png`,
    },
  };
}

export function review(review: Review): UserReview {
  return {
    '@type': 'UserReview',
    '@id': review._id,
    reviewBody: review.text,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.score,
      bestRating: 5,
    },
    datePublished: review.createdAt.toISOString(),
    isFamilyFriendly: true,
    itemReviewed: {
      '@type': 'ProductGroup',
      '@id': review.articleId,
    },
  };
}
