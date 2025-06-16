// src/Components/LandingPage/LandingPage.js
import React from 'react';
import './LandingPage.css';
import Hero from './Hero/Hero';
import Features from './Features/Features';
import Courses from './Courses/Courses';
import Testimonials from './Testimonials/Testimonials';
import CTA from './CTA/CTA';
import Contact from './Contact/Contact';
import Footer from './Footer/Footer';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Hero />
      <Features />
      <Courses />
      <Testimonials />
      <CTA />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;
