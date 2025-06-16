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
