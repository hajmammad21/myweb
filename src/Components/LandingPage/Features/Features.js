// src/Components/LandingPage/Features/Features.js
import React from 'react';
import './Features.css';

const features = [
  {
    icon: '🎯',
    title: 'یادگیری هدفمند',
    description: 'دوره‌هایی طراحی شده برای تمرکز بر نیازهای واقعی بازار کار.',
    gradient: 'blue-purple'
  },
  {
    icon: '🚀',
    title: 'پیشرفت سریع',
    description: 'آموزش فشرده و کاربردی برای رسیدن به تسلط در کمترین زمان.',
    gradient: 'purple-pink'
  },
  {
    icon: '🎓',
    title: 'مدرک معتبر',
    description: 'صدور گواهی‌نامه پایان دوره با قابلیت ارائه در رزومه شغلی.',
    gradient: 'green-emerald'
  },
];

const Features = () => {
  return (
    <section className="features-section" id="features">
      {/* Background decorative elements */}
      <div className="bg-decorations">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <div className="badge-icon">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h2 className="section-title">
            ویژگی‌های
            <span className="title-gradient"> پلتفرم ما</span>
          </h2>
          <p className="section-description">
            مزایای کلیدی که باعث تمایز ما از دیگر پلتفرم‌ها می‌شود و تجربه یادگیری منحصر به فردی ارائه می‌دهد.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`feature-card feature-card-${index + 1}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Gradient border effect */}
              <div className={`card-border gradient-${feature.gradient}`}></div>
              
              {/* Content */}
              <div className="card-content">
                {/* Icon container */}
                <div className={`feature-icon-container gradient-${feature.gradient}`}>
                  <span className="feature-icon">{feature.icon}</span>
                </div>
                
                {/* Title */}
                <h3 className="feature-title">{feature.title}</h3>
                
                {/* Description */}
                <p className="feature-description">{feature.description}</p>
                
                {/* Hover effect arrow */}
                <div className="feature-cta">
                  <span className={`cta-text gradient-${feature.gradient}`}>
                    بیشتر بدانید
                    <svg className="cta-arrow" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </span>
                </div>
              </div>
              
              {/* Floating particles */}
              <div className="floating-particles">
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
                <div className="particle particle-3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;