'use client';
import Link from 'next/link';
import { useContext, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Heart, User, ShoppingCart, X, Menu } from 'lucide-react';
import { CartContext } from '../context/CartContext';

export default function Header(){
  const { itemCount } = useContext(CartContext);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="header-logo-link">
          <img src="/pakstyle-logo.png" alt="PakStyle" className="header-logo" />
        </Link>

        <nav className="header-nav desktop-only">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/products" className="nav-link">Catalog</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
        </nav>

        <div className="header-actions">
          <button onClick={toggleSearch} type="button" className="header-icon-btn" aria-label="Search">
            <Search size={20} />
          </button>
          <Link href="/wishlist" className="header-icon-btn desktop-only" aria-label="Wishlist">
            <Heart size={20} />
          </Link>
          <Link href="/cart" className="header-icon-btn cart-icon" aria-label="Cart">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="cart-badge">{itemCount}</span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="header-icon-btn mobile-only"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <nav className="mobile-nav">
          <Link href="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/products" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Catalog</Link>
          <Link href="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          <Link href="/wishlist" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Wishlist</Link>
        </nav>
      </div>

      {/* Search Drawer */}
      <div className={`search-drawer ${searchOpen ? 'search-drawer-open' : ''}`}>
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
                className="search-input"
              />
            </div>
            <button type="submit" className="search-submit-btn">Search</button>
            <button type="button" onClick={closeSearch} className="header-icon-btn">
              <X size={20} />
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}
