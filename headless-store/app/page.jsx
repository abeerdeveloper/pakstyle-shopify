import { getPakstyleProducts } from '../lib/pakstyle-products';
import ProductGrid from '../components/ProductGrid';

export default async function HomePage(){
  const products = getPakstyleProducts(4);

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
          <p style={{color:'#4B5563',fontSize:16,margin:0}}>Discover our latest collection blending Pakistani heritage with modern streetwear.</p>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
