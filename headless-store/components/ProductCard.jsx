'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function ProductCard({ product }){
  const { addItem } = useContext(CartContext);
  const img = product.images?.edges?.[0]?.node?.url || '/placeholder.png';
  const price = product.priceRange?.minVariantPrice?.amount;

  return (
    <div className="card" style={{padding:12}}>
      <Link href={`/products/${product.handle}`}>
        <img src={img} alt={product.title} style={{width:'100%',aspectRatio:'3/4',objectFit:'cover',borderRadius:6}} />
      </Link>
      <div className="mt-2 font-semibold">{product.title}</div>
      <div className="text-sm text-gray-600">{price} {product.priceRange?.minVariantPrice?.currencyCode}</div>
      <div className="mt-2">
        <button className="btn-accent" onClick={()=>addItem(product.variants.edges[0].node.id,1)}>Add to cart</button>
      </div>
    </div>
  );
}
