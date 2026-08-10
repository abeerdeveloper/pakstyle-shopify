'use client';
import { useState } from 'react';
import { getPakstyleProducts } from '../../lib/pakstyle-products';
import ProductCard from '../../components/ProductCard';
import { SlidersHorizontal, Grid, Sparkles } from 'lucide-react';

export default function ProductsPage(){
  const allProducts = getPakstyleProducts(8);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['All', 'Streetwear', 'Traditional', 'Outerwear', 'Bottoms'];

  // Filter products based on selected category tag
  const filteredProducts = allProducts.filter(product => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Traditional') {
      return product.title.toLowerCase().includes('kurta') || product.title.toLowerCase().includes('shalwar') || product.title.toLowerCase().includes('waistcoat');
    }
    if (selectedCategory === 'Streetwear') {
      return product.title.toLowerCase().includes('hoodie') || product.title.toLowerCase().includes('tee') || product.title.toLowerCase().includes('polo');
    }
    if (selectedCategory === 'Outerwear') {
      return product.title.toLowerCase().includes('jacket') || product.title.toLowerCase().includes('waistcoat') || product.title.toLowerCase().includes('hoodie');
    }
    if (selectedCategory === 'Bottoms') {
      return product.title.toLowerCase().includes('joggers') || product.title.toLowerCase().includes('pants');
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseInt(a.priceRange.minVariantPrice.amount.replace(/,/g, ''));
    const priceB = parseInt(b.priceRange.minVariantPrice.amount.replace(/,/g, ''));
    if (sortBy === 'low-high') return priceA - priceB;
    if (sortBy === 'high-low') return priceB - priceA;
    return 0;
  });

  return (
    <div className="container" style={{paddingBottom: 80}}>
      {/* Hero Banner */}
      <section className="catalog-hero">
        <img src="/catalog-bg.png" alt="PakStyle Catalog Banner" className="catalog-hero-bg" />
        <div className="catalog-hero-overlay" />
        <div className="catalog-hero-content">
          <span className="hero-badge" style={{marginBottom: 16}}>
            <Sparkles size={14} style={{display:'inline', marginRight: 6}} /> Official 2026 Catalog
          </span>
          <h1 className="catalog-hero-title">The Complete Collection</h1>
          <p className="catalog-hero-subtitle">
            Explore handcrafted Pakistani traditional wear and bold urban streetwear designed for statement style.
          </p>
        </div>
      </section>

      {/* Filter and Controls Toolbar */}
      <section className="catalog-controls">
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`category-pill ${selectedCategory === cat ? 'category-pill-active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="catalog-sort-wrapper">
          <SlidersHorizontal size={16} color="#64748B" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="catalog-sort-select"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </section>

      {/* Product Grid Results */}
      <section>
        <div style={{marginBottom: 20, display:'flex', justifyContent:'space-between', alignItems:'center', color:'#64748B', fontSize: 14}}>
          <span>Showing <strong>{sortedProducts.length}</strong> items</span>
          {selectedCategory !== 'All' && (
            <button onClick={() => setSelectedCategory('All')} style={{background:'none', border:'none', color:'var(--color-accent)', fontWeight: 600, cursor:'pointer'}}>
              Clear filter
            </button>
          )}
        </div>

        {sortedProducts.length === 0 ? (
          <div style={{textAlign:'center', padding:'80px 20px', background:'var(--color-bg-light)', borderRadius:20}}>
            <Grid size={48} color="#94A3B8" style={{margin:'0 auto 16px'}} />
            <h3 style={{fontSize:20, color:'var(--color-primary)', margin:0}}>No products found in this category</h3>
            <p style={{color:'#64748B', marginTop:8}}>Try selecting another category filter above.</p>
          </div>
        ) : (
          <div className="product-grid">
            {sortedProducts.map((p, idx) => (
              <ProductCard key={p.id} product={p} badge={idx === 0 ? 'Trending' : null} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
