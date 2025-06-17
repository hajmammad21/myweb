import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../supabaseClient'; // Adjust path as needed
import { useNavigate } from 'react-router-dom'; // For navigation
import './Auth.css';

const Auth = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    verificationCode: ''
  });
  const [showVerification, setShowVerification] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validatePhone = (phone) => {
    const iranPhoneRegex = /^(\+98|0)?9\d{9}$/;
    return iranPhoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/[^\d+]/g, '');
    
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
    
    if (cleaned.startsWith('9')) {
      const withZero = '0' + cleaned;
      return formatPhone(withZero);
    }
    
    return cleaned;
  };

  const normalizePhone = (phone) => {
    // Remove all spaces and formatting
    const cleaned = phone.replace(/\s/g, '');
    
    // Convert to standard format (starting with +98)
    if (cleaned.startsWith('0')) {
      return '+98' + cleaned.slice(1);
    } else if (cleaned.startsWith('9')) {
      return '+98' + cleaned;
    } else if (cleaned.startsWith('+98')) {
      return cleaned;
    }
    
    return cleaned;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const formattedPhone = formatPhone(value);
      setFormData(prev => ({ ...prev, [name]: formattedPhone }));
    } else if (name === 'verificationCode') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 5);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
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

  // Function to check if user exists in Supabase
  const checkUserExists = async (phone) => {
    try {
      const normalizedPhone = normalizePhone(phone);
      const { data, error } = await supabase
        .from('users') // Replace 'users' with your actual table name
        .select('*')
        .eq('phone', normalizedPhone)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new users
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error checking user:', error);
      return null;
    }
  };

  // Function to create or update user in Supabase
  const saveUserToSupabase = async (userData) => {
    try {
      const normalizedPhone = normalizePhone(userData.phone);
      
      // First, check if user exists
      const existingUser = await checkUserExists(userData.phone);
      
      if (existingUser) {
        // Update existing user
        const { data, error } = await supabase
          .from('users') // Replace with your table name
          .update({
            name: userData.name,
            updated_at: new Date().toISOString()
          })
          .eq('phone', normalizedPhone)
          .select()
          .single();

        if (error) throw error;
        return { user: data, isNewUser: false };
      } else {
        // Create new user
        const { data, error } = await supabase
          .from('users') // Replace with your table name
          .insert([
            {
              name: userData.name,
              phone: normalizedPhone,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (error) throw error;
        return { user: data, isNewUser: true };
      }
    } catch (error) {
      console.error('Error saving user to Supabase:', error);
      throw error;
    }
  };

  // Function to trigger authentication state change
  const triggerAuthChange = () => {
    // Dispatch custom event to notify Header component
    window.dispatchEvent(new Event('authChange'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (!showVerification) {
        // Send verification code (simulate)
        await new Promise(resolve => setTimeout(resolve, 1500));
        setShowVerification(true);
        setErrors({});
      } else {
        // Verify code and save to Supabase
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would verify the code here
        // For demo purposes, we'll assume the code is always valid
        
        // Save user to Supabase
        const result = await saveUserToSupabase({
          name: formData.name,
          phone: formData.phone
        });

        // Store user data in localStorage for session management
        // Make sure the structure matches what Header expects
        const userForStorage = {
          id: result.user.id,
          name: result.user.name,
          phone: result.user.phone,
          created_at: result.user.created_at,
          updated_at: result.user.updated_at
        };
        
        localStorage.setItem('user', JSON.stringify(userForStorage));
        
        // Trigger auth change event for Header component
        triggerAuthChange();
        
        // Show success message
        if (result.isNewUser) {
          toast.success(`${formData.name} عزیز، حساب شما با موفقیت ایجاد شد!`);
        } else {
          toast.success(`خوش آمدید ${formData.name}! ورود موفقیت‌آمیز بود.`);
        }
        
        // Reset form
        setFormData({ name: '', phone: '', verificationCode: '' });
        setShowVerification(false);
        setErrors({});
        
        // Navigate to home page
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ 
        submit: error.message || 'خطایی رخ داد. لطفاً دوباره تلاش کنید.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.loading('کد تایید مجدداً ارسال شد');
    } catch (error) {
      toast.error('خطا در ارسال کد. لطفاً دوباره تلاش کنید.');
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
      <div className="background-decoration-1"></div>
      <div className="background-decoration-2"></div>
      <div className="background-decoration-3"></div>

      <div className="auth-card">
        <div className="card-header-decoration"></div>

        <div className="auth-header">
          <h1 className="auth-title">شرکت حقوقی</h1>
          <p className="auth-subtitle">
            {showVerification 
              ? 'کد تایید را وارد کنید' 
              : 'به سامانه وارد شوید یا ثبت‌نام کنید'
            }
          </p>
        </div>

        <div className="auth-form">
          {!showVerification ? (
            <>
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