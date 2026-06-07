import { shopifyFetch } from '../../../lib/shopify';
import { searchProducts } from '../../../lib/queries';
import ProductGrid from '../../../components/ProductGrid';

export default async function SearchPage({ searchParams }){
  const q = searchParams?.q || '';
  if (!q) return (
    <div className="container">
      <h1 className="text-2xl">Search</h1>
      <p>Enter a query to search products.</p>
    </div>
  );

  const res = await shopifyFetch({ query: searchProducts, variables: { query: q, first: 24 } });
  const products = res?.data?.products?.edges?.map(e=>e.node) || [];

  return (
    <div className="container">
      <h1 className="text-2xl">Search results for "{q}"</h1>
      {products.length ? <ProductGrid products={products} /> : <p className="mt-4">No results found.</p>}
    </div>
  );
}
