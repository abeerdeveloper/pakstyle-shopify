'use client';
import Link from 'next/link';
import { useContext, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Heart, User, ShoppingCart, X } from 'lucide-react';
import { CartContext } from '../context/CartContext';

export default function Header(){
  const { itemCount } = useContext(CartContext);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const toggleSearch = () => setSearchOpen((open) => !open);
  const closeSearch = () => setSearchOpen(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    closeSearch();
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      closeSearch();
    }
  };

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
          <button onClick={toggleSearch} type="button" style={{background:'none',border:'none',padding:0,display:'inline-flex',alignItems:'center',justifyContent:'center',color:'#111827',cursor:'pointer',transition:'color 160ms ease'}}>
            <Search size={20} />
          </button>
          <Link href="/wishlist" style={{display:'inline-flex',color:'#111827',transition:'color 160ms ease'}}>
            <Heart size={20} />
          </Link>
          <a href="https://pakstyle-dev.myshopify.com/account" target="_blank" rel="noreferrer" style={{display:'inline-flex',color:'#111827',transition:'color 160ms ease'}}>
            <User size={20} />
          </a>
          <Link href="/cart" style={{position:'relative',display:'inline-flex',alignItems:'center',justifyContent:'center',color:'#111827'}}>
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span style={{position:'absolute',top:-8,right:-10,height:18,width:18,borderRadius:9999,background:'#111827',color:'#FFFFFF',fontSize:10,display:'flex',alignItems:'center',justifyContent:'center'}}>{itemCount}</span>
            )}
          </Link>
        </div>
      </div>

      <div style={{maxHeight: searchOpen ? 140 : 0, opacity: searchOpen ? 1 : 0, overflow: 'hidden', transition: 'max-height 220ms ease, opacity 220ms ease', borderBottom: searchOpen ? '1px solid #E5E7EB' : 'none', background: '#FFFFFF'}}>
        <form onSubmit={handleSubmit} style={{padding:'20px 0'}}>
          <div className="container" style={{display:'flex',gap:12,alignItems:'center'}}>
            <div style={{position:'relative',flex:1}}>
              <Search size={18} style={{position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',color:'#9CA3AF'}} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for products..."
                aria-label="Search products"
                style={{width:'100%',padding:'16px 16px 16px 44px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:16,fontFamily:'var(--font-body)',outline:'none'}}
              />
            </div>
            <button type="submit" style={{background:'#F97316',color:'#FFFFFF',border:'none',borderRadius:12,padding:'16px 24px',fontWeight:700,cursor:'pointer',fontFamily:'var(--font-heading)'}}>Search</button>
            <button type="button" onClick={closeSearch} style={{background:'none',border:'none',padding:0,display:'inline-flex',alignItems:'center',justifyContent:'center',color:'#111827',cursor:'pointer'}}>
              <X size={20} />
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}
