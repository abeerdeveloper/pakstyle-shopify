'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Footer(){
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <img src="/pakstyle-logo.png" alt="PakStyle" className="footer-logo" />
            <p className="footer-tagline">Dress Bold. Live Bold.</p>
            <p className="footer-desc">Premium Pakistani streetwear blending heritage craftsmanship with modern urban fashion.</p>
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="TikTok">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="footer-col">
            <h4 className="footer-col-title">Shop</h4>
            <Link href="/products" className="footer-link">All Products</Link>
            <Link href="/products" className="footer-link">New Arrivals</Link>
            <Link href="/products" className="footer-link">Streetwear</Link>
            <Link href="/products" className="footer-link">Traditional</Link>
          </div>

          {/* Company Column */}
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <Link href="/contact" className="footer-link">About Us</Link>
            <Link href="/contact" className="footer-link">Contact</Link>
            <Link href="/contact" className="footer-link">Careers</Link>
            <Link href="/contact" className="footer-link">Press</Link>
          </div>

          {/* Newsletter Column */}
          <div className="footer-col">
            <h4 className="footer-col-title">Stay in the Loop</h4>
            <p className="footer-desc">Get exclusive drops, style guides & 10% off your first order.</p>
            {subscribed ? (
              <div className="newsletter-success">✓ You're in! Check your inbox.</div>
            ) : (
              <form onSubmit={handleNewsletter} className="newsletter-form">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">→</button>
              </form>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="footer-payments">
          <span className="payment-label">We Accept</span>
          <div className="payment-icons">
            <span className="payment-badge">VISA</span>
            <span className="payment-badge">Mastercard</span>
            <span className="payment-badge">JazzCash</span>
            <span className="payment-badge">Easypaisa</span>
            <span className="payment-badge">COD</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} PakStyle. All rights reserved.</span>
          <span className="footer-credit">
            Built with ❤️ by <a href="https://github.com/abeerdeveloper" target="_blank" rel="noreferrer">Abeer Dev</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
