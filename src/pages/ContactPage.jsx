import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Send, CheckCircle2, AlertCircle, Mail, MapPin, Compass, Shield } from 'lucide-react';
import { fetchContactInfo } from '../lib/sanity';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'Studio Collaboration',
    message: '',
    // Honeypot field for bot protection (invisible to humans)
    website_url_hp: '',
  });

  const [contactData, setContactData] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

  useEffect(() => {
    let cancelled = false;
    fetchContactInfo()
      .then((data) => {
        if (!cancelled && data) setContactData(data);
      })
      .catch((err) => {
        console.warn('Could not load Contact data from Sanity:', err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const emailAddress = contactData?.email || '';
  const locationText = contactData?.location || '';
  const privacyNoteText = contactData?.privacyNote || '';

  const socialLinks = Array.isArray(contactData?.socialLinks) && contactData.socialLinks.length > 0
    ? contactData.socialLinks
    : [];

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide an email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 15) {
      errs.message = 'Please provide a detailed inquiry (minimum 15 characters).';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Bot trap check
    if (formData.website_url_hp) {
      // Silently discard spam bot submissions
      setStatus('success');
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const responseText = await response.text();
      let result = {};
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error('The contact service is only available on the deployed website. Please email directly for now.');
      }
      if (!response.ok) throw new Error(result.error || 'Unable to send');
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrors({ form: error.message });
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-layout-grid">
        {/* Left Info Column */}
        <div className="contact-info-column">
          <div className="contact-eyebrow">CONTACT / IVO</div>
          <h1 className="contact-heading">
            Get in<br />
            <em>touch.</em>
          </h1>

          <p className="contact-description">
            Studio collaborations, design reviews, academic conversations, or just a conversation about architecture in general — I'm happy to hear from you. I try to reply to everything that comes in, even if it takes a few days during studio deadlines.
          </p>

          <div className="contact-channels">
            <div className="channel-block">
              <span className="channel-k">EMAIL</span>
              <a href={`mailto:${emailAddress}`} className="channel-v link">
                <Mail size={16} />
                <span>{emailAddress}</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="channel-block">
              <span className="channel-k">BASED IN</span>
              <div className="channel-v">
                <MapPin size={16} />
                <span>{locationText}</span>
              </div>
            </div>

            <div className="channel-block">
              <span className="channel-k">ELSEWHERE</span>
              <div className="social-links-row">
                {socialLinks.map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="sep">/</span>}
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.platform} <ArrowUpRight size={13} />
                    </a>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="contact-form-column">
          <div className="form-card">
            <div className="form-header">
              <h3>Send a message</h3>
              <span className="form-notice">I’LL GET BACK TO YOU AS SOON AS I CAN</span>
            </div>

            {status === 'success' ? (
              <div className="form-success-state" role="status">
                <CheckCircle2 size={36} className="success-icon" />
                <h4>Inquiry Received</h4>
                <p>
                  Thank you for reaching out. A confirmation has been logged, and I will review your message and reply via <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setFormData({
                      name: '',
                      email: '',
                      inquiryType: 'Studio Collaboration',
                      message: '',
                      website_url_hp: '',
                    });
                    setStatus('idle');
                  }}
                  className="reset-form-btn"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {errors.form && (
                  <div className="form-alert-error" role="alert">
                    <AlertCircle size={16} />
                    <span>{errors.form}</span>
                  </div>
                )}

                {/* Anti-spam honeypot */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <label htmlFor="website_url_hp">Leave empty</label>
                  <input
                    type="text"
                    id="website_url_hp"
                    name="website_url_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website_url_hp}
                    onChange={(e) => setFormData({ ...formData, website_url_hp: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="name">
                    <span>NAME / STUDIO</span>
                    <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Adebayo Adeleke"
                    className={errors.name ? 'input-error' : ''}
                    aria-required="true"
                  />
                  {errors.name && <span className="field-error-msg">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <span>EMAIL ADDRESS</span>
                    <span className="req">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@organization.com"
                    className={errors.email ? 'input-error' : ''}
                    aria-required="true"
                  />
                  {errors.email && <span className="field-error-msg">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="inquiryType">
                    <span>NATURE OF INQUIRY</span>
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="inquiryType"
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    >
                      <option value="Studio Collaboration">Studio Collaboration</option>
                      <option value="Academic Critique / Review">Academic Critique / Review</option>
                      <option value="Community / TTA Platform">The Thinking Architect (TTA)</option>
                      <option value="Press / Publication">Press / Publication Inquiry</option>
                      <option value="General Conversation">General Conversation</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    <span>MESSAGE</span>
                    <span className="req">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="What’s this about? Feel free to include as much context as’s useful — timeline, what you’re looking for, or just what prompted you to reach out."
                    className={errors.message ? 'input-error' : ''}
                    aria-required="true"
                  />
                  {errors.message && <span className="field-error-msg">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="submit-btn"
                >
                  {status === 'submitting' ? (
                    <span>TRANSMITTING...</span>
                  ) : (
                    <>
                      <span>Send</span>
                      <Send size={15} />
                    </>
                  )}
                </button>

                <div className="form-privacy-note">
                  <Shield size={13} />
                  <span>{privacyNoteText}</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
