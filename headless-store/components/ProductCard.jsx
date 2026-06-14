'use client';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';

export default function ProductCard({ product }){
  const { addItem } = useContext(CartContext);
  const [imageError, setImageError] = useState(false);
  const img = product.images?.edges?.[0]?.node?.url;
  const price = product.priceRange?.minVariantPrice?.amount;
  const currency = product.priceRange?.minVariantPrice?.currencyCode;

  return (
    <div className="product-card">
      <Link href={`/products/${product.handle}`} style={{display:'block'}}>
        {img && !imageError ? (
          <img src={img} alt={product.title} onError={() => setImageError(true)} />
        ) : (
          <div style={{minHeight:0,background:'#F3F4F6',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 20px',textAlign:'center'}}>
            <div>
              <div style={{fontSize:32,color:'#9CA3AF',marginBottom:12}}>🖼️</div>
              <div style={{color:'#6B7280',fontWeight:600}}>{product.title}</div>
            </div>
          </div>
        )}
      </Link>
      <div style={{padding:20}}>
        <div className="product-card-title">{product.title}</div>
        <div className="product-card-price">{price} {currency}</div>
        <button className="product-card-button" onClick={()=>addItem(product.variants.edges[0].node.id,1)}>Add to Cart</button>
      </div>
    </div>
  );
}
