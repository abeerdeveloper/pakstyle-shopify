'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setFormState({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div>
      <section style={{ background: '#0F172A', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ margin: 0, color: '#FFFFFF', fontFamily: 'var(--font-heading)', fontSize: 48, fontWeight: 800 }}>Contact</h1>
          <p style={{ marginTop: 16, color: '#E5E7EB', fontSize: 18, lineHeight: 1.7 }}>
            We'd love to hear from you. Drop us a message anytime!
          </p>
        </div>
      </section>

      <section style={{ background: '#FFFFFF', padding: '48px 24px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: 24, alignItems: 'stretch' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16, padding: 40, boxShadow: '0 20px 50px rgba(15, 23, 42, 0.06)' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 28, color: '#0F172A' }}>Send Us a Message</h2>
            <p style={{ marginTop: 12, color: '#6B7280', fontSize: 15 }}>Fill out the form below and our team will get back to you shortly.</p>
            {submitted && (
              <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: '#ECFDF5', color: '#166534', border: '1px solid #D1FAE5' }}>
                Thank you! Your message has been received.
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ marginTop: 24, display: 'grid', gap: 20 }}>
              <label style={{ display: 'grid', gap: 8, fontSize: 14, color: '#111827', fontWeight: 600 }}>
                Name
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #D1D5DB', fontSize: 15, fontFamily: 'var(--font-body)' }}
                />
              </label>
              <label style={{ display: 'grid', gap: 8, fontSize: 14, color: '#111827', fontWeight: 600 }}>
                Email
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #D1D5DB', fontSize: 15, fontFamily: 'var(--font-body)' }}
                />
              </label>
              <label style={{ display: 'grid', gap: 8, fontSize: 14, color: '#111827', fontWeight: 600 }}>
                Phone
                <input
                  type="tel"
                  name="phone"
                  value={formState.phone}
                  onChange={handleChange}
                  placeholder="+92 300 0000000"
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #D1D5DB', fontSize: 15, fontFamily: 'var(--font-body)' }}
                />
              </label>
              <label style={{ display: 'grid', gap: 8, fontSize: 14, color: '#111827', fontWeight: 600 }}>
                Message
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  rows={6}
                  required
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #D1D5DB', fontSize: 15, fontFamily: 'var(--font-body)', resize: 'vertical' }}
                />
              </label>
              <button type="submit" style={{ width: '100%', background: '#F97316', color: '#FFFFFF', border: 'none', borderRadius: 12, padding: '16px 20px', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-heading)' }}>
                Send Message
              </button>
            </form>
          </div>

          <div style={{ display: 'grid', gap: 20 }}>
            <div style={{ background: '#0F172A', borderRadius: 16, padding: 32, color: '#FFFFFF', display: 'grid', gap: 20, minHeight: 220 }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 24 }}>Get in Touch</h3>
                <p style={{ marginTop: 8, color: '#D1D5DB' }}>Reach out to us via email, phone, or visit our location.</p>
              </div>
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ minWidth: 36, minHeight: 36, borderRadius: 12, background: '#F97316', display: 'grid', placeItems: 'center' }}><Mail size={20} color="#FFFFFF" /></span>
                  <div>
                    <div style={{ fontWeight: 600 }}>Email</div>
                    <div style={{ color: '#D1D5DB' }}>info@pakstyle.pk</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ minWidth: 36, minHeight: 36, borderRadius: 12, background: '#F97316', display: 'grid', placeItems: 'center' }}><Phone size={20} color="#FFFFFF" /></span>
                  <div>
                    <div style={{ fontWeight: 600 }}>Phone</div>
                    <div style={{ color: '#D1D5DB' }}>+92 300 0000000</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ minWidth: 36, minHeight: 36, borderRadius: 12, background: '#F97316', display: 'grid', placeItems: 'center' }}><MapPin size={20} color="#FFFFFF" /></span>
                  <div>
                    <div style={{ fontWeight: 600 }}>Location</div>
                    <div style={{ color: '#D1D5DB' }}>Abbottabad, Pakistan</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#0F172A', borderRadius: 16, padding: 32, color: '#FFFFFF', borderLeft: '4px solid #F97316', display: 'grid', gap: 16 }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 24 }}>Business Hours</h3>
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D1D5DB' }}><span>Monday - Friday</span><span>9:00 AM - 6:00 PM</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D1D5DB' }}><span>Saturday</span><span>10:00 AM - 4:00 PM</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D1D5DB' }}><span>Sunday</span><span>Closed</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 1024px) {
          .container {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
