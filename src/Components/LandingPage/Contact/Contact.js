// src/Components/LandingPage/Contact/Contact.js
import React from 'react';
import './Contact.css';

const contactItems = [
  {
    icon: '📞',
    title: 'تماس تلفنی',
    info: '۰۲۱-۱۲۳۴۵۶۷۸',
  },
  {
    icon: '✉️',
    title: 'ایمیل',
    info: 'support@example.com',
  },
  {
    icon: '📍',
    title: 'آدرس',
    info: 'تهران، خیابان آزادی، پلاک ۲۳',
  },
];

const Contact = () => {
  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">ارتباط با ما</h2>
          <p className="section-description">
            از طریق راه‌های زیر می‌توانید با تیم پشتیبانی ما در ارتباط باشید.
          </p>
        </div>
        <div className="contact-grid">
          {contactItems.map((item, index) => (
            <div className="contact-card" key={index}>
              <div className="contact-icon">{item.icon}</div>
              <h3 className="contact-title">{item.title}</h3>
              <p className="contact-info">{item.info}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
