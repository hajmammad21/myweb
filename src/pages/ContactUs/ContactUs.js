import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactMethod: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  if (!formData.name || !formData.email || !formData.message) {
    toast.error('لطفاً تمام فیلدهای ضروری را پر کنید');
    setIsSubmitting(false);
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    toast.error('لطفاً ایمیل معتبری وارد کنید');
    setIsSubmitting(false);
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message
      }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success('پیام شما با موفقیت ارسال شد. در اسرع وقت با شما تماس خواهیم گرفت');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        contactMethod: 'email'
      });
    } else {
      toast.error(data.error || 'خطا در ارسال پیام');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('خطا در ارسال پیام. لطفاً دوباره تلاش کنید');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">تماس با ما</h1>
          <p className="hero-subtitle">
            ما آماده پاسخگویی به سوالات و راهنمایی شما هستیم
          </p>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-header">
                <h2>راه های ارتباطی</h2>
                <p>برای تماس با ما می‌توانید از روش های زیر استفاده کنید</p>
              </div>

              <div className="info-items">
                <div className="info-item">
                  <div className="info-icon">
                    <span>📞</span>
                  </div>
                  <div className="info-details">
                    <h3>تلفن تماس</h3>
                    <p>021-88776655</p>
                    <p>021-88776644</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <span>📧</span>
                  </div>
                  <div className="info-details">
                    <h3>ایمیل</h3>
                    <p>info@lawcompany.ir</p>
                    <p>support@lawcompany.ir</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <span>📍</span>
                  </div>
                  <div className="info-details">
                    <h3>آدرس</h3>
                    <p>تهران، خیابان ولیعصر، پلاک 123</p>
                    <p>طبقه 5، واحد 10</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <span>⏰</span>
                  </div>
                  <div className="info-details">
                    <h3>ساعات کاری</h3>
                    <p>شنبه تا چهارشنبه: 8:00 - 17:00</p>
                    <p>پنج‌شنبه: 8:00 - 13:00</p>
                  </div>
                </div>
              </div>

              <div className="social-links">
                <h3>شبکه های اجتماعی</h3>
                <div className="social-icons">
                  <a href="#" className="social-icon telegram">
                    <span>📱</span>
                    <span>تلگرام</span>
                  </a>
                  <a href="#" className="social-icon instagram">
                    <span>📷</span>
                    <span>اینستاگرام</span>
                  </a>
                  <a href="#" className="social-icon whatsapp">
                    <span>💬</span>
                    <span>واتساپ</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <div className="form-card">
              <div className="form-header">
                <h2>پیام خود را برای ما ارسال کنید</h2>
                <p>با پر کردن فرم زیر، پیام خود را برای ما ارسال کنید</p>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">نام و نام خانوادگی *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="نام کامل خود را وارد کنید"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">ایمیل *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@gmail.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">شماره تماس</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="09123456789"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">موضوع</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                    >
                      <option value="">انتخاب موضوع</option>
                      <option value="general">سوال عمومی</option>
                      <option value="technical">مشکل فنی</option>
                      <option value="courses">درخواست دوره</option>
                      <option value="cooperation">همکاری</option>
                      <option value="complaint">شکایت</option>
                      <option value="suggestion">پیشنهاد</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contactMethod">روش ارتباط مطلوب</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="email"
                        checked={formData.contactMethod === 'email'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      ایمیل
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="phone"
                        checked={formData.contactMethod === 'phone'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      تماس تلفنی
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="sms"
                        checked={formData.contactMethod === 'sms'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      پیامک
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">پیام شما *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="پیام خود را اینجا بنویسید..."
                    rows="6"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <span>📤</span>
                      ارسال پیام
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="faq-section">
          <div className="faq-header">
            <h2>سوالات متداول</h2>
            <p>پاسخ سوالات رایج را اینجا مطالعه کنید</p>
          </div>

          <div className="faq-grid">
            <div className="faq-item">
              <h3>چگونه می‌توانم در آزمون‌ها شرکت کنم؟</h3>
              <p>پس از ثبت نام و ورود به حساب کاربری، می‌توانید از بخش آزمون‌ها اقدام به شرکت در تست‌های مختلف کنید.</p>
            </div>
            <div className="faq-item">
              <h3>آیا دوره‌های آنلاین ارائه می‌دهید؟</h3>
              <p>بله، ما دوره‌های آنلاین متنوعی در زمینه حقوق ارائه می‌دهیم که می‌توانید از بخش دوره‌های خصوصی مشاهده کنید.</p>
            </div>
            <div className="faq-item">
              <h3>چگونه با پشتیبانی تماس بگیرم؟</h3>
              <p>می‌توانید از طریق تلفن، ایمیل و یا همین فرم تماس با تیم پشتیبانی ما در ارتباط باشید.</p>
            </div>
            <div className="faq-item">
              <h3>آیا امکان بازپرداخت وجود دارد؟</h3>
              <p>در صورت عدم رضایت از خدمات، طبق قوانین سایت امکان بازپرداخت در شرایط خاص وجود دارد.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;