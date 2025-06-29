import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token: urlToken } = useParams();

  // Check if URL contains reset token
  useEffect(() => {
    // Check for query parameter
    const searchParams = new URLSearchParams(location.search);
    const queryToken = searchParams.get('token');
    
    // Use URL parameter or query parameter
    const token = urlToken || queryToken;
    
    if (token && token.trim() !== '') {
      setResetToken(token);
      setIsResetPassword(true);
      setIsLogin(false);
      setIsForgotPassword(false);
      
      // Clear form data
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    }
  }, [urlToken, location.search]);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setIsResetPassword(false);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
    setIsLogin(false);
    setIsResetPassword(false);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setIsLogin(true);
    setIsResetPassword(false);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email } = formData;

    if (!email) {
      toast.error('لطفاً ایمیل خود را وارد کنید');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/forgot-password', {
        email
      });

      toast.success('لینک بازنشانی رمز عبور به ایمیل شما ارسال شد');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      handleBackToLogin();
    } catch (err) {
      const message = err.response?.data?.message || 'خطا در ارسال ایمیل بازنشانی';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      toast.error('لطفاً هر دو فیلد رمز عبور را پر کنید');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('رمز عبور و تأیید آن باید یکسان باشند');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('رمز عبور باید حداقل ۶ کاراکتر باشد');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/reset-password', {
        token: resetToken,
        password
      });

      toast.success('رمز عبور با موفقیت تغییر یافت');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setResetToken('');
      handleBackToLogin();
      
      // Clear the token from URL
      navigate('/login', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'خطا در تغییر رمز عبور';
      toast.error(message);
      
      // If token is invalid or expired, redirect to forgot password
      if (err.response?.status === 400 || err.response?.status === 404) {
        setIsResetPassword(false);
        setIsForgotPassword(true);
        setResetToken('');
        navigate('/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isForgotPassword) {
      return handleForgotPasswordSubmit(e);
    }

    if (isResetPassword) {
      return handleResetPasswordSubmit(e);
    }

    setLoading(true);

    const { name, email, password } = formData;

    if (!email || !password || (!isLogin && !name)) {
      toast.error('لطفاً تمام فیلدهای ضروری را پر کنید');
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? '/auth/login' : '/auth/register';

    try {
      const res = await axios.post(`http://localhost:5000/api${endpoint}`, {
        name,
        email,
        password
      });

      if (isLogin) {
        const token = res.data.access_token;
        const refreshToken = res.data.refresh_token;
        const user = res.data.user;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        window.dispatchEvent(new Event('authChange'));
        
        toast.success('با موفقیت وارد شدید');
        
        navigate('/');
      } else {
        toast.success('ثبت‌نام با موفقیت انجام شد. اکنون وارد شوید');
        setIsLogin(true);
      }

      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      const message = err.response?.data?.message || 'خطا در اتصال به سرور';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (isResetPassword) return 'تنظیم رمز عبور جدید';
    if (isForgotPassword) return 'بازنشانی رمز عبور';
    return isLogin ? 'ورود' : 'ثبت‌نام';
  };

  const getSubtitle = () => {
    if (isResetPassword) return 'رمز عبور جدید خود را وارد کنید';
    if (isForgotPassword) return 'ایمیل خود را وارد کنید تا لینک بازنشانی برای شما ارسال شود';
    return isLogin
      ? 'برای ادامه وارد حساب کاربری خود شوید'
      : 'برای ایجاد حساب جدید فرم زیر را پر کنید';
  };

  return (
    <div className="auth-container">
      <div className="background-decoration-1"></div>
      <div className="background-decoration-2"></div>
      <div className="background-decoration-3"></div>

      <div className="auth-card">
        <div className="card-header-decoration"></div>
        <div className="auth-header">
          <h2 className="auth-title">{getTitle()}</h2>
          <p className="auth-subtitle">{getSubtitle()}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && !isForgotPassword && !isResetPassword && (
            <div className="form-group">
              <label className="form-label" htmlFor="name">نام کامل</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="نام و نام خانوادگی"
                required
              />
            </div>
          )}

          {!isResetPassword && (
            <div className="form-group">
              <label className="form-label" htmlFor="email">ایمیل</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="ایمیل شما"
                required
              />
            </div>
          )}

          {!isForgotPassword && (
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                {isResetPassword ? 'رمز عبور جدید' : 'رمز عبور'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder={isResetPassword ? 'رمز عبور جدید' : 'رمز عبور'}
                required
              />
            </div>
          )}

          {isResetPassword && (
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">تأیید رمز عبور جدید</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="تأیید رمز عبور جدید"
                required
              />
            </div>
          )}

          {isLogin && !isForgotPassword && !isResetPassword && (
            <div className="forgot-password-link">
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="forgot-password-button"
              >
                فراموشی رمز عبور؟
              </button>
            </div>
          )}

          <button
            type="submit"
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>
                  {isResetPassword ? 'تغییر رمز عبور...' : isForgotPassword ? 'ارسال...' : isLogin ? 'ورود...' : 'ثبت‌نام...'}
                </span>
              </>
            ) : (
              isResetPassword ? 'تغییر رمز عبور' : isForgotPassword ? 'ارسال لینک بازنشانی' : isLogin ? 'ورود' : 'ثبت‌نام'
            )}
          </button>
        </form>

        <div className="auth-footer">
          {isResetPassword ? (
            <p className="footer-text">
              یادتان آمد؟{' '}
              <button onClick={handleBackToLogin} className="back-button">
                بازگشت به ورود
              </button>
            </p>
          ) : isForgotPassword ? (
            <p className="footer-text">
              یادتان آمد؟{' '}
              <button onClick={handleBackToLogin} className="back-button">
                بازگشت به ورود
              </button>
            </p>
          ) : (
            <p className="footer-text">
              {isLogin ? 'حساب کاربری ندارید؟' : 'قبلاً ثبت‌نام کرده‌اید؟'}{' '}
              <button onClick={handleToggle} className="back-button">
                {isLogin ? 'ثبت‌نام کنید' : 'وارد شوید'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export async function fetchWithAuth(url, options = {}, retry = true) {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!(options.body instanceof FormData)) {
    options.headers = {
      ...(options.headers || {}),
      'Content-Type': 'application/json',
    };
  }

  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  let response = await fetch(url, options);

  if (response.status === 401 && retry && refreshToken) {
    const refreshResponse = await fetch('http://localhost:5000/api/auth/refresh', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem('token', data.access_token);

      options.headers.Authorization = `Bearer ${data.access_token}`;
      return fetchWithAuth(url, options, false);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }

  return response;
}

export default Auth;