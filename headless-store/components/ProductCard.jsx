'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function ProductCard({ product }){
  const { addItem } = useContext(CartContext);
  const img = product.images?.edges?.[0]?.node?.url || '/placeholder.png';
  const price = product.priceRange?.minVariantPrice?.amount;
  const currency = product.priceRange?.minVariantPrice?.currencyCode;

  return (
    <div className="product-card">
      <Link href={`/products/${product.handle}`} style={{display:'block'}}>
        <img src={img} alt={product.title} />
      </Link>
      <div style={{padding:20}}>
        <div className="product-card-title">{product.title}</div>
        <div className="product-card-price">{price} {currency}</div>
        <button className="product-card-button" onClick={()=>addItem(product.variants.edges[0].node.id,1)}>Add to Cart</button>
      </div>
    </div>
  );
}
