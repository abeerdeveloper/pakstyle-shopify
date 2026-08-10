import Link from 'next/link';
import { Truck, ShieldCheck, Banknote, RefreshCw, ArrowRight } from 'lucide-react';
import { getPakstyleProducts } from '../lib/pakstyle-products';
import ProductCard from '../components/ProductCard';

export default async function HomePage(){
  const products = getPakstyleProducts(8);
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero-banner">
        <img src="/hero-bg.png" alt="PakStyle Streetwear" className="hero-bg-img" />
        <div className="hero-content">
          <span className="hero-badge">New Collection 2026</span>
          <h1 className="hero-title">Dress Bold.<br />Live Bold.</h1>
          <p className="hero-subtitle">
            PakStyle — Premium streetwear blending Pakistani heritage craftsmanship with modern urban fashion.
          </p>
          <Link href="/products" className="hero-cta-btn">
            Shop Collection <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-badges-grid">
        <div className="trust-badge-item">
          <div className="trust-badge-icon">
            <Truck size={24} />
          </div>
          <div>
            <h4 className="trust-badge-title">Free Nationwide Delivery</h4>
            <p className="trust-badge-desc">On all orders above 3,000 PKR</p>
          </div>
        </div>
        <div className="trust-badge-item">
          <div className="trust-badge-icon">
            <Banknote size={24} />
          </div>
          <div>
            <h4 className="trust-badge-title">Cash on Delivery</h4>
            <p className="trust-badge-desc">Pay at your doorstep anywhere in PK</p>
          </div>
        </div>
        <div className="trust-badge-item">
          <div className="trust-badge-icon">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="trust-badge-title">100% Premium Quality</h4>
            <p className="trust-badge-desc">Handcrafted with finest fabrics</p>
          </div>
        </div>
        <div className="trust-badge-item">
          <div className="trust-badge-icon">
            <RefreshCw size={24} />
          </div>
          <div>
            <h4 className="trust-badge-title">Hassle-Free Exchange</h4>
            <p className="trust-badge-desc">7-day easy size exchange guarantee</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{margin:'60px 0'}}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Discover our signature Pakistani streetwear & traditional fusion lineup.</p>
          </div>
          <Link href="/products" className="section-link">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="product-grid">
          {featuredProducts.map((p, idx) => (
            <ProductCard key={p.id} product={p} badge={idx === 0 ? 'Best Seller' : idx === 1 ? 'New' : null} />
          ))}
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="brand-story-section">
        <div className="brand-story-grid">
          <div>
            <img src="/brand-story.png" alt="PakStyle Heritage & Craftsmanship" className="brand-story-img" />
          </div>
          <div className="brand-story-content">
            <span className="hero-badge" style={{borderColor:'var(--color-border)',color:'var(--color-primary)',background:'#FFFFFF'}}>Our Heritage</span>
            <h2 className="brand-story-title">Craftsmanship Meets Urban Streetwear</h2>
            <p className="brand-story-desc">
              At PakStyle, we fuse centuries-old Pakistani artisan techniques — from intricate truck art patterns and Sindhi embroidery to Urdu calligraphy — with modern streetwear silhouettes. Every piece tells a story of culture, pride, and unapologetic self-expression.
            </p>
            <Link href="/products" className="hero-cta-btn" style={{padding:'12px 28px',fontSize:15}}>
              Explore Story Collection
            </Link>
          </div>
        </div>
      </section>

      {/* All Arrivals Grid */}
      <section style={{margin:'60px 0'}}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Full Collection</h2>
            <p className="section-subtitle">Explore our latest drops and classic heritage wear.</p>
          </div>
        </div>
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
