import ProductCard from './ProductCard';

export default function ProductGrid({ products }){
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:16}}>
      {products.map(p=> <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
