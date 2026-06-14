import { shopifyFetch } from '../lib/shopify';
import { getProducts } from '../lib/queries';
import ProductGrid from '../components/ProductGrid';

export default async function HomePage(){
  // The current storefront is using Shopify's default test catalog data until real clothing products are added.
  const res = await shopifyFetch({ query: getProducts, variables: { first: 4 } });
  const products = res?.data?.products?.edges?.map(e=>e.node) || [];

  return (
    <div className="container">
      <section style={{background:'linear-gradient(135deg, #0F172A 0%, #1F2937 100%)',borderRadius:24,padding:'80px 32px',marginBottom:40}}>
        <div style={{maxWidth:700,margin:'0 auto',textAlign:'center'}}>
          <h1 style={{color:'#FFFFFF',fontFamily:'var(--font-heading)',fontSize:56,fontWeight:800,margin:0,lineHeight:1.05}}>Dress Bold. Live Bold.</h1>
          <p style={{color:'#E5E7EB',fontSize:18,marginTop:20}}>PakStyle — Premium streetwear for the bold generation.</p>
        </div>
      </section>

      <section>
        <div style={{marginBottom:24,display:'flex',flexDirection:'column',gap:12}}>
          <h2 style={{fontFamily:'var(--font-heading)',fontSize:32,color:'#0F172A',margin:0}}>Featured Products</h2>
          <p style={{color:'#4B5563',fontSize:16,margin:0}}>Showing the first four items from Shopify's test catalog for now. Real clothing products are coming soon.</p>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
