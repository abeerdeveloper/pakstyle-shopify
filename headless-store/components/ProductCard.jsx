'use client';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';

export default function ProductCard({ product, badge }){
  const { addItem } = useContext(CartContext);
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  // Prefer localImage (PakStyle catalog), then Shopify image
  const img = product.localImage || product.images?.edges?.[0]?.node?.url;
  const price = product.priceRange?.minVariantPrice?.amount;
  const currency = product.priceRange?.minVariantPrice?.currencyCode;

  return (
    <div className="product-card">
      <div className="card-img-wrapper">
        <Link href={`/products/${product.handle}`}>
          {img && !imageError ? (
            <img src={img} alt={product.title} onError={() => setImageError(true)} />
          ) : (
            <div style={{width:'100%',height:'100%',background:'#F1F5F9',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',textAlign:'center'}}>
              <div>
                <div style={{fontSize:32,marginBottom:8}}>🛍️</div>
                <div style={{color:'#64748B',fontWeight:600,fontSize:14}}>{product.title}</div>
              </div>
            </div>
          )}
        </Link>
        {badge && <span className="card-badge">{badge}</span>}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="card-wishlist-btn"
          aria-label="Add to Wishlist"
          type="button"
        >
          <Heart size={18} fill={isLiked ? '#EF4444' : 'none'} color={isLiked ? '#EF4444' : 'currentColor'} />
        </button>
      </div>

      <div className="card-content">
        <Link href={`/products/${product.handle}`} style={{textDecoration:'none'}}>
          <div className="product-card-title">{product.title}</div>
        </Link>
        <div className="product-card-price">{price} {currency}</div>
        <div style={{marginTop:'auto'}}>
          <button
            className="product-card-button"
            onClick={()=>addItem(product.variants.edges[0].node.id || product.id, 1)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
