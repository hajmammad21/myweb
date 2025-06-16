// src/Components/LandingPage/CTA/CTA.js
import React from 'react';
import './CTA.css';

const CTA = () => {
  return (
    <section className="cta-section" id="cta">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">همین حالا شروع کن!</h2>
          <p className="cta-description">
            برای رسیدن به اهداف حرفه‌ای خود هیچ‌وقت دیر نیست. با ثبت‌نام در دوره‌های ما، اولین گام را محکم بردار.
          </p>
          <div className="cta-buttons">
            <a href="#courses" className="btn-primary">
              شروع مسیر یادگیری
              <span className="btn-arrow">→</span>
            </a>
            <a href="#contact" className="btn-secondary">
              ارتباط با پشتیبانی
              <span className="btn-arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
