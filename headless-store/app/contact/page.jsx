'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, ChevronDown, CheckCircle2, Send } from 'lucide-react';

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', subject: 'General Query', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "What is your delivery timeframe across Pakistan?",
      a: "Orders in major cities (Lahore, Karachi, Islamabad, Rawalpindi) are delivered in 2-3 business days. Other regions across Pakistan take 3-5 business days."
    },
    {
      q: "Do you offer Cash on Delivery (COD)?",
      a: "Yes! We offer 100% Cash on Delivery nationwide across Pakistan on all orders. You can inspect your parcel upon arrival."
    },
    {
      q: "How does the 7-day size exchange process work?",
      a: "If your garment size isn't a perfect fit, simply contact our support team within 7 days. We will pick up the item and ship the replacement size free of charge."
    },
    {
      q: "Where is PakStyle located?",
      a: "Our flagship design studio & headquarters is located in Abbottabad, Pakistan, with fulfillment warehouses in Lahore and Karachi."
    }
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setFormState({ name: '', email: '', phone: '', subject: 'General Query', message: '' });
  };

  return (
    <div className="container" style={{paddingBottom: 80}}>
      {/* Contact Hero Banner */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="hero-badge">
            <MessageSquare size={14} style={{display:'inline', marginRight: 6}} /> Get In Touch
          </span>
          <h1 className="contact-hero-title">We'd Love to Hear From You</h1>
          <p className="contact-hero-subtitle">
            Have questions about fit, order status, or custom sizing? Our team is available 6 days a week to assist you.
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Info Cards */}
      <section className="contact-grid-section">
        {/* Form Container */}
        <div className="contact-form-card">
          <h2 className="contact-card-title">Send Us a Message</h2>
          <p className="contact-card-desc">Fill out the details below and we will respond within 2 hours.</p>

          {submitted && (
            <div className="contact-success-alert">
              <CheckCircle2 size={20} />
              <div>
                <strong>Thank you for contacting PakStyle!</strong>
                <p style={{margin: '2px 0 0', fontSize: 14}}>Your message has been dispatched to our support team.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="e.g. Abeer Awan"
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formState.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="General Query">General Query</option>
                  <option value="Order Tracking">Order Tracking</option>
                  <option value="Size Exchange">Size Exchange</option>
                  <option value="Wholesale Inquiry">Wholesale Inquiry</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Message *</label>
              <textarea
                name="message"
                value={formState.message}
                onChange={handleChange}
                placeholder="Tell us how we can help you..."
                rows={5}
                required
                className="form-input"
                style={{resize:'vertical'}}
              />
            </div>

            <button type="submit" className="contact-submit-btn">
              Send Message <Send size={18} />
            </button>
          </form>
        </div>

        {/* Info Cards Side */}
        <div className="contact-info-column">
          <div className="contact-info-card">
            <h3 className="info-card-heading">Contact Details</h3>
            
            <div className="info-item">
              <div className="info-icon-badge">
                <Mail size={20} />
              </div>
              <div>
                <span className="info-item-label">Email Us</span>
                <span className="info-item-value">support@pakstyle.pk</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-badge">
                <Phone size={20} />
              </div>
              <div>
                <span className="info-item-label">Call / WhatsApp</span>
                <span className="info-item-value">+92 300 0000000</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-badge">
                <MapPin size={20} />
              </div>
              <div>
                <span className="info-item-label">Headquarters</span>
                <span className="info-item-value">PakStyle Studio, Abbottabad, Pakistan</span>
              </div>
            </div>
          </div>

          <div className="contact-info-card" style={{borderLeft: '4px solid var(--color-accent)'}}>
            <h3 className="info-card-heading" style={{display:'flex', alignItems:'center', gap:8}}>
              <Clock size={20} color="var(--color-accent)" /> Operating Hours
            </h3>
            <div className="hours-row">
              <span>Monday – Saturday</span>
              <span>10:00 AM – 8:00 PM</span>
            </div>
            <div className="hours-row">
              <span>Sunday</span>
              <span style={{color:'var(--color-accent)'}}>Closed</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <p className="faq-subtitle">Quick answers to common questions about orders, shipping, and sizing.</p>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openFaq === index ? 'faq-item-open' : ''}`}
              onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
            >
              <div className="faq-question">
                <span>{faq.q}</span>
                <ChevronDown size={20} className="faq-chevron" />
              </div>
              {openFaq === index && (
                <div className="faq-answer">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
