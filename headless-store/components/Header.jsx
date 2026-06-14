'use client';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { Search, Heart, User, ShoppingCart } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const iconStyle = {
  color: '#111827',
  cursor: 'pointer',
  transition: 'color 160ms ease',
};

const iconHover = {
  color: '#F97316',
};

export default function Header(){
  const { itemCount } = useContext(CartContext);
  const [searchOpen, setSearchOpen] = useState(false);

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
          <button onClick={() => setSearchOpen(!searchOpen)} style={{background:'none',border:'none',padding:0}}>
            <Search size={20} style={iconStyle} onMouseOver={e => e.currentTarget.style.color = '#F97316'} onMouseOut={e => e.currentTarget.style.color = '#111827'} />
          </button>
          <Link href="/wishlist" style={{display:'inline-flex'}}>
            <Heart size={20} style={iconStyle} onMouseOver={e => e.currentTarget.style.color = '#F97316'} onMouseOut={e => e.currentTarget.style.color = '#111827'} />
          </Link>
          <Link href="/account" style={{display:'inline-flex'}}>
            <User size={20} style={iconStyle} onMouseOver={e => e.currentTarget.style.color = '#F97316'} onMouseOut={e => e.currentTarget.style.color = '#111827'} />
          </Link>
          <Link href="/cart" style={{position:'relative',display:'inline-flex'}}>
            <ShoppingCart size={20} style={iconStyle} onMouseOver={e => e.currentTarget.style.color = '#F97316'} onMouseOut={e => e.currentTarget.style.color = '#111827'} />
            {itemCount > 0 && (
              <span style={{position:'absolute',top:-8,right:-10,height:18,width:18,borderRadius:9999,background:'#111827',color:'#FFFFFF',fontSize:10,display:'flex',alignItems:'center',justifyContent:'center'}}>{itemCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
