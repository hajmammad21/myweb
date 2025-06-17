// src/Components/LandingPage/Testimonials/Testimonials.js
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import './Testimonials.css';

const testimonials = [
  {
    name: 'سارا رضایی',
    role: 'توسعه‌دهنده فرانت‌اند',
    company: 'شرکت تکنولوژی پارس',
    quote: 'پلتفرم بسیار حرفه‌ای و کاربردی! توانستم با کمک این دوره‌ها شغل مورد علاقه‌ام را پیدا کنم و مهارت‌هایم را به سطح جدیدی برسانم.',
    avatar: 'https://i.pravatar.cc/80?img=47',
    rating: 5,
  },
  {
    name: 'امیر محمدی',
    role: 'دانشجوی مهندسی نرم‌افزار',
    company: 'دانشگاه تهران',
    quote: 'تدریس روان و مثال‌های واقعی باعث شد مفاهیم را سریع یاد بگیرم. بسیار راضی هستم و به همه توصیه می‌کنم.',
    avatar: 'https://i.pravatar.cc/80?img=12',
    rating: 4,
  },
  {
    name: 'فاطمه احمدی',
    role: 'طراح UI/UX',
    company: 'آژانس دیجیتال نوآوران',
    quote: 'دوره‌های عملی و به‌روز که واقعاً با نیازهای بازار کار همخوانی دارد. پشتیبانی فوق‌العاده و محتوای غنی.',
    avatar: 'https://i.pravatar.cc/80?img=32',
    rating: 5,
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`star ${index < rating ? 'filled' : ''}`}
      >
        ★
      </span>
    ));
  };

  return (
    <section className="testimonials-section" id="testimonials">
      {/* Background decorative elements */}
      <div className="bg-decoration">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="container">
        <div className="section-header">
          <div className="section-badge">تجربه‌های موفق</div>
          <h2 className="section-title">
            نظرات <span className="highlight">دانشجویان</span>
          </h2>
          <p className="section-description">
            تجربه‌های واقعی کسانی که از دوره‌های ما استفاده کرده‌اند و موفق شده‌اند
          </p>
        </div>

        <div className="testimonials-wrapper">
          <div className="testimonials-container"
               onMouseEnter={() => setIsAutoPlaying(false)}
               onMouseLeave={() => setIsAutoPlaying(true)}>
            
            {/* Navigation buttons */}
            <button 
              className="nav-btn prev-btn" 
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <ChevronRight size={24} />
            </button>
            
            <button 
              className="nav-btn next-btn" 
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Testimonial cards */}
            <div className="testimonials-track" 
                 style={{ transform: `translateX(${currentIndex * -100}%)` }}>
              {testimonials.map((testimonial, index) => (
                <div className="testimonial-card" key={index}>
                  <div className="card-content">
                    {/* Quote icon */}
                    <div className="quote-icon">
                      <Quote size={32} />
                    </div>

                    {/* Quote text */}
                    <blockquote className="testimonial-quote">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* Rating */}
                    <div className="testimonial-rating">
                      {renderStars(testimonial.rating)}
                    </div>

                    {/* Author info */}
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        <img src={testimonial.avatar} alt={testimonial.name} />
                        <div className="avatar-ring"></div>
                      </div>
                      <div className="author-info">
                        <h4 className="author-name">{testimonial.name}</h4>
                        <p className="author-role">{testimonial.role}</p>
                        <p className="author-company">{testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination dots */}
          <div className="testimonial-pagination">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`pagination-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              >
                <span className="dot-inner"></span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;