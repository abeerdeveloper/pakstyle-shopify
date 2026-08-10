import { getPakstyleProducts } from '../../lib/pakstyle-products';
import ProductGrid from '../../components/ProductGrid';

export default async function ProductsPage(){
  const products = getPakstyleProducts(8);

  return (
    <div className="container">
      <section style={{background:'#0F172A',borderRadius:20,padding:'48px 32px',marginBottom:40,textAlign:'center'}}>
        <h1 style={{color:'#FFFFFF',fontFamily:'var(--font-heading)',fontSize:42,margin:0}}>Catalog</h1>
        <p style={{color:'#9CA3AF',fontSize:16,marginTop:12}}>Explore our full collection of Pakistani-inspired fashion</p>
      </section>

      <section style={{background:'#FFFFFF',borderRadius:20,padding:24,boxShadow:'0 10px 30px rgba(15,23,42,0.05)'}}>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
