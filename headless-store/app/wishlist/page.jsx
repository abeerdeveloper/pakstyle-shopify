'use client';
import Link from 'next/link';

export default function WishlistPage() {
  return (
    <div>
      <section style={{ background: '#0F172A', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ margin: 0, color: '#FFFFFF', fontFamily: 'var(--font-heading)', fontSize: 48, fontWeight: 800 }}>Wishlist</h1>
        </div>
      </section>

      <section style={{ background: '#FFFFFF', padding: '48px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', padding: '60px 24px', borderRadius: 24, boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)' }}>
          <p style={{ margin: 0, color: '#0F172A', fontSize: 22, fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Your wishlist is empty</p>
          <p style={{ margin: '16px auto 0', color: '#6B7280', fontSize: 16, maxWidth: 520 }}>Browse our catalog and add items you'd love to save for later.</p>
          <Link href="/products" style={{ display: 'inline-block', marginTop: 32, background: '#F97316', color: '#FFFFFF', borderRadius: 12, padding: '14px 28px', fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-heading)' }}>Browse Products</Link>
        </div>
      </section>
    </div>
  );
}
