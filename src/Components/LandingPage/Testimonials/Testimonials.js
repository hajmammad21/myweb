// src/Components/LandingPage/Testimonials/Testimonials.js
import React from 'react';
import './Testimonials.css';

const testimonials = [
  {
    name: 'سارا رضایی',
    role: 'توسعه‌دهنده فرانت‌اند',
    quote:
      'پلتفرم بسیار حرفه‌ای و کاربردی! توانستم با کمک این دوره‌ها شغل مورد علاقه‌ام را پیدا کنم.',
    avatar: 'https://i.pravatar.cc/80?img=47',
    rating: 5,
  },
  {
    name: 'امیر محمدی',
    role: 'دانشجوی مهندسی نرم‌افزار',
    quote:
      'تدریس روان و مثال‌های واقعی باعث شد مفاهیم را سریع یاد بگیرم. بسیار راضی هستم.',
    avatar: 'https://i.pravatar.cc/80?img=12',
    rating: 4,
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">نظرات دانشجویان</h2>
          <p className="section-description">
            تجربه‌های واقعی کسانی که از دوره‌های ما استفاده کرده‌اند.
          </p>
        </div>

        <div className="testimonial-container">
          {testimonials.map((t, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-content">
                <img className="testimonial-avatar" src={t.avatar} alt={t.name} />
                <div className="testimonial-stars">
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}

          <div className="testimonial-nav">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={`nav-dot ${idx === 0 ? 'active' : ''}`}
                aria-label={`Slide ${idx + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
