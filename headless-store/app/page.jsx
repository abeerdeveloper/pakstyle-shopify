import { shopifyFetch } from '../lib/shopify';
import { getProducts } from '../lib/queries';
import ProductGrid from '../components/ProductGrid';

export default async function HomePage(){
  // The current storefront is using Shopify's default test catalog data until real clothing products are added.
  const res = await shopifyFetch({ query: getProducts, variables: { first: 4 } });
  const products = res?.data?.products?.edges?.map(e=>e.node) || [];

  return (
    <div className="container">
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold" style={{color:'var(--primary)'}}>Dress Bold. Live Bold.</h1>
        <p className="mt-4 text-gray-600">PakStyle — curated clothing for fearless living.</p>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Featured Products</h2>
            <p className="text-sm text-gray-500 mt-2">Showing the first four items from Shopify's default test catalog. Real apparel products will replace this inventory soon.</p>
          </div>
        </div>
        <ProductGrid products={products} />
      </section>

      <section className="mt-12 p-8 rounded-lg" style={{background:'#0F172A',color:'#fff'}}>
        <h3 className="text-2xl">Join the movement</h3>
        <p className="mt-2">Sign up for early drops and exclusive offers.</p>
      </section>
    </div>
  );
}
