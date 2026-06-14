'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { Search, Heart, User, ShoppingCart } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const iconButtonStyle = {
  background: 'none',
  border: 'none',
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#111827',
  cursor: 'pointer',
  transition: 'color 160ms ease',
};

export default function Header(){
  const { itemCount } = useContext(CartContext);

  return (
    <header style={{background:'#FFFFFF', borderBottom:'1px solid #E5E7EB', boxShadow:'0 1px 4px rgba(15, 23, 42, 0.08)'}}>
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 0'}}>
        <Link href="/" style={{fontWeight:700,fontSize:22,color:'#111827',fontFamily:'Poppins, system-ui, sans-serif',textDecoration:'none'}}>PakStyle</Link>

        <nav style={{display:'flex',gap:24,alignItems:'center',color:'#111827',fontSize:14,fontWeight:500}}>
          <Link href="/" style={{color:'#111827',textDecoration:'none'}}>Home</Link>
          <Link href="/products" style={{color:'#111827',textDecoration:'none'}}>Catalog</Link>
          <Link href="/contact" style={{color:'#111827',textDecoration:'none'}}>Contact</Link>
        </nav>

        <div style={{display:'flex',gap:18,alignItems:'center'}}>
          <Link href="/search" style={iconButtonStyle}>
            <Search size={20} color="currentColor" />
          </Link>
          <Link href="/wishlist" style={iconButtonStyle}>
            <Heart size={20} color="currentColor" />
          </Link>
          <a href="https://pakstyle-dev.myshopify.com/account" target="_blank" rel="noreferrer" style={iconButtonStyle}>
            <User size={20} color="currentColor" />
          </a>
          <Link href="/cart" style={{position:'relative',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
            <ShoppingCart size={20} color="#111827" />
            {itemCount > 0 && (
              <span style={{position:'absolute',top:-8,right:-10,height:18,width:18,borderRadius:9999,background:'#111827',color:'#FFFFFF',fontSize:10,display:'flex',alignItems:'center',justifyContent:'center'}}>{itemCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
