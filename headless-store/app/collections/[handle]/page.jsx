import { shopifyFetch } from '../../../../lib/shopify';
import { getCollectionByHandle } from '../../../../lib/queries';
import ProductGrid from '../../../../components/ProductGrid';

export default async function CollectionPage({ params }){
  const handle = params.handle;
  const res = await shopifyFetch({ query: getCollectionByHandle, variables: { handle, first: 24 } });
  const collection = res?.data?.collection || null;
  const products = collection?.products?.edges?.map(e=>e.node) || [];

  if (!collection) return <div className="container">Collection not found</div>;

  return (
    <div className="container">
      <h1 className="text-3xl font-semibold">{collection.title}</h1>
      <p className="text-gray-600 mt-2">{collection.description}</p>
      <section className="mt-6">
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
