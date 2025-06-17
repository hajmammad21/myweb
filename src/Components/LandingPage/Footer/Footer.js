// src/Components/LandingPage/Footer/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-content">
          <h3 className="footer-title">آکادمی آموزش آنلاین</h3>
          <p className="footer-subtitle">یادگیری تخصصی، مسیر شغلی مطمئن</p>
          
          <nav className="footer-nav">
            <ul className="footer-links">
              <li><a href="#teachers-guide" className="footer-link">راهنمای مدرسان</a></li>
              <li><a href="#social-networks" className="footer-link">شبکه های اجتماعی</a></li>
              <li><a href="#about-us" className="footer-link">درباره ما</a></li>
              <li><a href="#contact-us" className="footer-link">تماس با ما</a></li>
              <li><a href="#faq" className="footer-link">سوالات متداول</a></li>
            </ul>
          </nav>
          
          <div className="footer-divider"></div>
          <p className="footer-copyright">
            © {new Date().getFullYear()} تمام حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;