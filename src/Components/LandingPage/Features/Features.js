// src/Components/LandingPage/Features/Features.js
import React from 'react';
import './Features.css';

const features = [
  {
    icon: '🎯',
    title: 'یادگیری هدفمند',
    description: 'دوره‌هایی طراحی شده برای تمرکز بر نیازهای واقعی بازار کار.'
  },
  {
    icon: '🚀',
    title: 'پیشرفت سریع',
    description: 'آموزش فشرده و کاربردی برای رسیدن به تسلط در کمترین زمان.'
  },
  {
    icon: '🎓',
    title: 'مدرک معتبر',
    description: 'صدور گواهی‌نامه پایان دوره با قابلیت ارائه در رزومه شغلی.'
  },
];

const Features = () => {
  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">ویژگی‌های پلتفرم ما</h2>
          <p className="section-description">
            مزایای کلیدی که باعث تمایز ما از دیگر پلتفرم‌ها می‌شود.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
