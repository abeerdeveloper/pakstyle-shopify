import { shopifyFetch } from '../../lib/shopify';
import { getProducts } from '../../lib/queries';
import ProductGrid from '../../components/ProductGrid';
import LoadingSpinner from '../../components/LoadingSpinner';

export default async function ProductsPage(){
  const res = await shopifyFetch({ query: getProducts, variables: { first: 24 } });
  const products = res?.data?.products?.edges?.map(e=>e.node) || [];

  return (
    <div className="container">
      <section style={{background:'#0F172A',borderRadius:20,padding:'48px 32px',marginBottom:40,textAlign:'center'}}>
        <h1 style={{color:'#FFFFFF',fontFamily:'var(--font-heading)',fontSize:42,margin:0}}>Catalog</h1>
      </section>

      <section style={{background:'#FFFFFF',borderRadius:20,padding:24,boxShadow:'0 10px 30px rgba(15,23,42,0.05)'}}>
        {products.length === 0 ? <LoadingSpinner /> : <ProductGrid products={products} />}
      </section>
    </div>
  );
}
