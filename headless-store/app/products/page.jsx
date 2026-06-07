import { shopifyFetch } from '../../lib/shopify';
import { getProducts } from '../../lib/queries';
import ProductGrid from '../../components/ProductGrid';
import LoadingSpinner from '../../components/LoadingSpinner';

export default async function ProductsPage(){
  const res = await shopifyFetch({ query: getProducts, variables: { first: 12 } });
  const products = res?.data?.products?.edges?.map(e=>e.node) || [];

  return (
    <div className="container">
      <h1 className="text-3xl font-semibold mb-6">Products</h1>
      {products.length === 0 ? <LoadingSpinner /> : <ProductGrid products={products} />}
    </div>
  );
}
