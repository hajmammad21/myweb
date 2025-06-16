import React, { useEffect, useState } from 'react';
import './Hero.css';

const Hero = () => {
  const [textVisible, setTextVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const textTimeout = setTimeout(() => setTextVisible(true), 300);
    const statsTimeout = setTimeout(() => setStatsVisible(true), 1500);
    
    return () => {
      clearTimeout(textTimeout);
      clearTimeout(statsTimeout);
    };
  }, []);

  // Counter animation for stats
  const [counts, setCounts] = useState({ courses: 0, students: 0, satisfaction: 0 });

  useEffect(() => {
    if (statsVisible) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = duration / steps;
      
      const targets = { courses: 50, students: 1000, satisfaction: 95 };
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setCounts({
          courses: Math.round(targets.courses * progress),
          students: Math.round(targets.students * progress),
          satisfaction: Math.round(targets.satisfaction * progress)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setCounts(targets); // Ensure final values are exact
        }
      }, increment);

      return () => clearInterval(timer);
    }
  }, [statsVisible]);

  return (
    <section className="hero-section">
      <div className="hero-background" />
      <div className="hero-pattern" />
      
      {/* Enhanced floating elements */}
      <div className="floating-element floating-1"></div>
      <div className="floating-element floating-2"></div>
      <div className="floating-element floating-3"></div>
      <div className="floating-element floating-4"></div>
      
      <div className="hero-content">
        <div className={`hero-text ${textVisible ? 'visible' : ''}`}>
          <h1 className="hero-title">
            <span className="gradient-text">شرکت حقوقی</span>{' '}
            <span className="white-text">در دنیای وکالت</span>
          </h1>
          
          <p className="hero-description">
            با ما وارد دنیای آموزش‌های تخصصی شوید و مهارت‌های مورد نیاز بازار کار را بیاموزید. 
            از تکنولوژی‌های روز دنیا تا مهارت‌های عملی، همه چیز در یک مکان.
          </p>
          
          <div className="hero-buttons">
            <a href="#courses" className="btn-primary">
              شروع یادگیری
              <span className="btn-arrow">→</span>
            </a>
            <a href="#features" className="btn-secondary">
              مشاهده امکانات
              <span className="btn-arrow">→</span>
            </a>
          </div>
        </div>
        
        <div className={`stats-grid ${statsVisible ? 'visible' : ''}`}>
          <div className="stat-item">
            <div className="stat-number">{counts.courses}+</div>
            <div className="stat-label">دوره تخصصی</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{counts.students.toLocaleString('fa-IR')}+</div>
            <div className="stat-label">دانشجوی فعال</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{counts.satisfaction}٪</div>
            <div className="stat-label">رضایت کاربران</div>
          </div>
        </div>
      </div>
      
      <div className="scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;