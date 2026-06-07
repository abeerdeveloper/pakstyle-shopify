'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar(){
  const [q,setQ] = useState('');
  const router = useRouter();
  return (
    <form onSubmit={(e)=>{e.preventDefault(); router.push(`/search?q=${encodeURIComponent(q)}`);}} style={{display:'flex',gap:8}}>
      <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search products" className="px-3 py-2 border rounded" />
      <button className="btn-accent">Search</button>
    </form>
  );
}
