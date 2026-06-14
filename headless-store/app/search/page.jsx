import { shopifyFetch } from '../../lib/shopify';
import { searchProducts } from '../../lib/queries';
import ProductGrid from '../../components/ProductGrid';

export default async function SearchPage({ searchParams }){
  const q = searchParams?.q?.trim() || '';

  if (!q) {
    return (
      <div className="container" style={{padding:'48px 0'}}>
        <h1 style={{fontFamily:'var(--font-heading)',fontSize:32,color:'#0F172A'}}>Search</h1>
        <p style={{marginTop:16,color:'#4B5563',fontSize:16}}>Enter a query to search products.</p>
      </div>
    );
  }

  const res = await shopifyFetch({ query: searchProducts, variables: { query: q, first: 24 } });
  const products = res?.data?.products?.edges?.map(e=>e.node) || [];

  return (
    <div className="container" style={{padding:'48px 0'}}>
      <h1 style={{fontFamily:'var(--font-heading)',fontSize:32,color:'#0F172A'}}>Search results for "{q}"</h1>
      {products.length ? (
        <div style={{marginTop:24}}>
          <ProductGrid products={products} />
        </div>
      ) : (
        <p style={{marginTop:16,color:'#4B5563',fontSize:16}}>No results found for "{q}".</p>
      )}
    </div>
  );
}
