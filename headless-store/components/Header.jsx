'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function Header(){
  const { itemCount } = useContext(CartContext);

  return (
    <header style={{background:'#0F172A',color:'#fff'}}>
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0'}}>
        <div style={{fontWeight:700,fontSize:20}}>PakStyle</div>
        <nav style={{display:'flex',gap:12,alignItems:'center'}}>
          <Link href="/" style={{color:'#fff'}}>Home</Link>
          <Link href="/products" style={{color:'#fff'}}>Products</Link>
          <Link href="/collections/new" style={{color:'#fff'}}>Collections</Link>
          <Link href="/sale" style={{color:'#fff'}}>Sale</Link>
          <Link href="/search" style={{color:'#fff'}}>Search</Link>
          <Link href="/cart" style={{color:'#fff'}}>Cart ({itemCount || 0})</Link>
        </nav>
      </div>
    </header>
  );
}
