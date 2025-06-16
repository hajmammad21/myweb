import React, { useState } from 'react';
import './Auth.css';

const Auth = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    verificationCode: ''
  });
  const [showVerification, setShowVerification] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validatePhone = (phone) => {
    // Iranian phone number validation
    const iranPhoneRegex = /^(\+98|0)?9\d{9}$/;
    return iranPhoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhone = (value) => {
    // Remove all non-digits except +
    const cleaned = value.replace(/[^\d+]/g, '');
    
    // Handle +98 prefix
    if (cleaned.startsWith('+98')) {
      const number = cleaned.slice(3);
      if (number.length >= 10) {
        return '+98 ' + number.slice(0, 10).replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
      } else if (number.length >= 6) {
        return '+98 ' + number.replace(/(\d{3})(\d{3})(\d*)/, '$1 $2 $3');
      } else if (number.length >= 3) {
        return '+98 ' + number.replace(/(\d{3})(\d*)/, '$1 $2');
      }
      return '+98 ' + number;
    }
    
    // Handle 0 prefix (standard Iranian format)
    if (cleaned.startsWith('0')) {
      if (cleaned.length >= 11) {
        return cleaned.slice(0, 11).replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
      } else if (cleaned.length >= 7) {
        return cleaned.replace(/(\d{4})(\d{3})(\d*)/, '$1 $2 $3');
      } else if (cleaned.length >= 4) {
        return cleaned.replace(/(\d{4})(\d*)/, '$1 $2');
      }
      return cleaned;
    }
    
    // Handle 9 prefix (without 0)
    if (cleaned.startsWith('9')) {
      const withZero = '0' + cleaned;
      return formatPhone(withZero);
    }
    
    return cleaned;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const formattedPhone = formatPhone(value);
      setFormData(prev => ({ ...prev, [name]: formattedPhone }));
    } else if (name === 'verificationCode') {
      // Only allow digits for verification code
      const digitsOnly = value.replace(/\D/g, '').slice(0, 5);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!showVerification) {
      if (!formData.name.trim()) {
        newErrors.name = 'نام الزامی است';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'نام باید حداقل ۲ کاراکتر باشد';
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'شماره تلفن الزامی است';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'شماره تلفن معتبر وارد کنید (مثال: 09123456789)';
      }
    } else {
      if (!formData.verificationCode.trim()) {
        newErrors.verificationCode = 'کد تایید الزامی است';
      } else if (formData.verificationCode.length !== 5) {
        newErrors.verificationCode = 'کد تایید باید ۵ رقم باشد';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (!showVerification) {
        // Simulate sending verification code
        await new Promise(resolve => setTimeout(resolve, 1500));
        setShowVerification(true);
        setErrors({});
      } else {
        // Simulate verification and login/signup
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if user exists (simulate)
        const userExists = Math.random() > 0.5; // Random for demo
        
        if (userExists) {
          alert(`خوش آمدید ${formData.name}! ورود موفقیت‌آمیز بود.`);
        } else {
          alert(`${formData.name} عزیز، حساب شما با موفقیت ایجاد شد!`);
        }
        
        // Reset form
        setFormData({ name: '', phone: '', verificationCode: '' });
        setShowVerification(false);
        setErrors({});
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'خطایی رخ داد. لطفاً دوباره تلاش کنید.' });
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('کد تایید مجدداً ارسال شد');
    } catch (error) {
      alert('خطا در ارسال کد. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setShowVerification(false);
    setFormData(prev => ({ ...prev, verificationCode: '' }));
    setErrors({});
  };

  return (
    <div className="auth-container">
      {/* Background decorative elements */}
      <div className="background-decoration-1"></div>
      <div className="background-decoration-2"></div>
      <div className="background-decoration-3"></div>

      <div className="auth-card">
        {/* Header decoration */}
        <div className="card-header-decoration"></div>

        {/* Logo/Title */}
        <div className="auth-header">
          <h1 className="auth-title">شرکت حقوقی</h1>
          <p className="auth-subtitle">
            {showVerification 
              ? 'کد تایید را وارد کنید' 
              : 'به سامانه وارد شوید یا ثبت‌نام کنید'
            }
          </p>
        </div>

        {/* Form */}
        <div className="auth-form">
          {!showVerification ? (
            <>
              {/* Name field */}
              <div className="form-group">
                <label className="form-label">
                  نام و نام خانوادگی *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="نام خود را وارد کنید"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="error-message">{errors.name}</p>
                )}
              </div>

              {/* Phone field */}
              <div className="form-group">
                <label className="form-label">
                  شماره تلفن همراه *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="09123456789"
                  className={`form-input phone ${errors.phone ? 'error' : ''}`}
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="error-message">{errors.phone}</p>
                )}
                <div className="phone-help">
                  <small>مثال: 09123456789 یا +989123456789</small>
                </div>
              </div>
            </>
          ) : (
            /* Verification Code */
            <div className="form-group verification">
              <label className="form-label">
                کد تایید
              </label>
              <div className="verification-info">
                <p>کد ۵ رقمی به شماره <strong>{formData.phone}</strong> ارسال شد</p>
              </div>
              <input
                type="text"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleInputChange}
                placeholder="کد ۵ رقمی"
                maxLength="5"
                className={`form-input verification-code ${errors.verificationCode ? 'error' : ''}`}
                disabled={isLoading}
                autoFocus
              />
              {errors.verificationCode && (
                <p className="error-message">{errors.verificationCode}</p>
              )}
              
              <div className="verification-actions">
                <button
                  type="button"
                  onClick={resendCode}
                  disabled={isLoading}
                  className="resend-button"
                >
                  ارسال مجدد کد
                </button>
                <button
                  type="button"
                  onClick={goBack}
                  disabled={isLoading}
                  className="back-button"
                >
                  بازگشت
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>لطفاً صبر کنید...</span>
              </div>
            ) : (
              showVerification ? 'تایید و ورود' : 'ارسال کد تایید'
            )}
          </button>

          {errors.submit && (
            <p className="error-message submit-error">{errors.submit}</p>
          )}
        </div>

        {/* Footer info */}
        <div className="auth-footer">
          <p className="footer-text">
            {showVerification 
              ? 'کد تایید معمولاً در کمتر از ۱ دقیقه دریافت می‌شود'
              : 'با وارد کردن اطلاعات، حساب کاربری شما ایجاد یا به روزرسانی می‌شود'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;