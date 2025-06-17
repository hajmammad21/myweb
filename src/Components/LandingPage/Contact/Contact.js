// src/Components/LandingPage/Contact/Contact.js
import React, { useEffect, useRef } from 'react';
import './Contact.css';

const contactItems = [
  {
    icon: '📞',
    title: 'تماس تلفنی',
    info: '۰۲۱-۱۲۳۴۵۶۷۸',
    gradient: 'phone'
  },
  {
    icon: '✉️',
    title: 'ایمیل',
    info: 'support@example.com',
    gradient: 'email'
  },
  {
    icon: '📍',
    title: 'آدرس',
    info: 'تهران، خیابان آزادی، پلاک ۲۳',
    gradient: 'location'
  },
];

const Contact = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const handleCardClick = (item) => {
    if (item.title === 'تماس تلفنی') {
      window.open(`tel:${item.info}`, '_self');
    } else if (item.title === 'ایمیل') {
      window.open(`mailto:${item.info}`, '_self');
    }
  };

  return (
    <section className="contact-section" id="contact" ref={sectionRef}>
      <div className="contact-bg-animation"></div>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-word">ارتباط</span>
            <span className="title-word">با</span>
            <span className="title-word">ما</span>
          </h2>
          <p className="section-description">
            از طریق راه‌های زیر می‌توانید با تیم پشتیبانی ما در ارتباط باشید.
          </p>
        </div>
        
        <div className="contact-grid">
          {contactItems.map((item, index) => (
            <div 
              className={`contact-card contact-card-${item.gradient}`}
              key={index}
              ref={(el) => cardsRef.current[index] = el}
              onClick={() => handleCardClick(item)}
            >
              <div className="card-shine"></div>
              <div className="contact-icon-wrapper">
                <div className="contact-icon">{item.icon}</div>
                <div className="icon-glow"></div>
              </div>
              <h3 className="contact-title">{item.title}</h3>
              <p className="contact-info">{item.info}</p>
              <div className="card-hover-effect"></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="floating-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${20 + Math.random() * 20}s`
          }}></div>
        ))}
      </div>
    </section>
  );
};

export default Contact;