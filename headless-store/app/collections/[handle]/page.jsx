import Link from 'next/link';
import { shopifyFetch } from '../../../lib/shopify';
import { getCollectionByHandle, getProducts } from '../../../lib/queries';
import ProductGrid from '../../../components/ProductGrid';

export default async function CollectionPage({ params }){
  const handle = params.handle;
  const res = await shopifyFetch({ query: getCollectionByHandle, variables: { handle, first: 24 } });
  const collection = res?.data?.collection || null;

  let title = 'All Products';
  let description = 'Showing the current product catalog for the store.';
  let products = [];
  let fallback = false;

  if (collection) {
    title = collection.title;
    description = collection.description;
    products = collection.products?.edges?.map(e => e.node) || [];
  } else {
    fallback = true;
    const allRes = await shopifyFetch({ query: getProducts, variables: { first: 24 } });
    products = allRes?.data?.products?.edges?.map(e => e.node) || [];
  }

  return (
    <div className="container">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-gray-600 mt-2">{description}</p>
        {fallback && (
          <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
            This collection is not available yet, so you&apos;re seeing all products instead. <Link href="/" className="font-semibold text-orange-600 hover:text-orange-700">Back to home</Link>
          </div>
        )}
      </div>
      <section className="mt-6">
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
