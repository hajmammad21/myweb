import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        const user = res.data.user;
        
        // Store both token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Dispatch custom event to notify header and other components
        window.dispatchEvent(new Event('authChange'));
        
        toast.success('با موفقیت وارد شدید');
        
        // Redirect to dashboard or home page
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

  return (
    <div className="auth-container">
      <div className="background-decoration-1"></div>
      <div className="background-decoration-2"></div>
      <div className="background-decoration-3"></div>

      <div className="auth-card">
        <div className="card-header-decoration"></div>
        <div className="auth-header">
          <h2 className="auth-title">{isLogin ? 'ورود' : 'ثبت‌نام'}</h2>
          <p className="auth-subtitle">
            {isLogin
              ? 'برای ادامه وارد حساب کاربری خود شوید'
              : 'برای ایجاد حساب جدید فرم زیر را پر کنید'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
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

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner">
                <span className="spinner"></span>
                {isLogin ? 'در حال ورود...' : 'در حال ثبت‌نام...'}
              </div>
            ) : (
              isLogin ? 'ورود' : 'ثبت‌نام'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="footer-text">
            {isLogin ? 'حساب کاربری ندارید؟' : 'قبلاً ثبت‌نام کرده‌اید؟'}{' '}
            <button onClick={handleToggle} className="back-button">
              {isLogin ? 'ثبت‌نام کنید' : 'وارد شوید'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;