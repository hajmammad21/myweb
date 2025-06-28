import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
    setIsLogin(false);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setIsLogin(true);
    setFormData({ name: '', email: '', password: '' });
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
      setFormData({ name: '', email: '', password: '' });
      handleBackToLogin();
    } catch (err) {
      const message = err.response?.data?.message || 'خطا در ارسال ایمیل بازنشانی';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isForgotPassword) {
      return handleForgotPasswordSubmit(e);
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

      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      const message = err.response?.data?.message || 'خطا در اتصال به سرور';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (isForgotPassword) return 'بازنشانی رمز عبور';
    return isLogin ? 'ورود' : 'ثبت‌نام';
  };

  const getSubtitle = () => {
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
          {!isLogin && !isForgotPassword && (
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

          {!isForgotPassword && (
            <div className="form-group">
              <label className="form-label" htmlFor="password">رمز عبور</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="رمز عبور"
                required
              />
            </div>
          )}

          {isLogin && !isForgotPassword && (
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
                  {isForgotPassword ? 'ارسال...' : isLogin ? 'ورود...' : 'ثبت‌نام...'}
                </span>
              </>
            ) : (
              isForgotPassword ? 'ارسال لینک بازنشانی' : isLogin ? 'ورود' : 'ثبت‌نام'
            )}
          </button>
        </form>

        <div className="auth-footer">
          {isForgotPassword ? (
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