import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../Components/Auth/Auth';
import './TeacherDashboard.css';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <button className="toast-close" onClick={onClose}>×</button>
      {message}
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

const TeacherDashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  
  const [toasts, setToasts] = useState([]);

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    fetchWithAuth('http://localhost:5000/api/users/teacher/notifications')
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setLoadingNotifications(false);
        
        const unreadCount = data.filter(n => !n.is_read).length;
        if (unreadCount > 0) {
          addToast(`شما ${unreadCount} اعلان خوانده نشده دارید`, 'info');
        }
      })
      .catch((error) => {
        setLoadingNotifications(false);
        addToast('خطا در بارگذاری اعلان‌ها', 'error');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !file || !price) {
      addToast('لطفاً تمام فیلدهای اجباری را پر کنید', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('file', file);

    try {
      addToast('در حال ارسال محصول...', 'info');
      
      const res = await fetchWithAuth('http://localhost:5000/api/users/teacher/products', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok) {
        addToast('محصول با موفقیت ارسال شد و در انتظار بررسی است', 'success');
        setTitle('');
        setDescription('');
        setPrice('');
        setFile(null);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      } else {
        addToast(data.msg || 'خطا در ارسال محصول', 'error');
      }
    } catch (err) {
      addToast('خطا در ارتباط با سرور', 'error');
    }
  };

  const markAsRead = (id) => {
    fetchWithAuth(`http://localhost:5000/api/users/notifications/${id}/read`, {
      method: 'PUT',
    })
      .then((res) => res.json())
      .then(() => {
        setNotifications((prev) => 
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        addToast('اعلان به عنوان خوانده شده علامت‌گذاری شد', 'success');
      })
      .catch((err) => {
        console.error('Error marking as read:', err);
        addToast('خطا در علامت‌گذاری اعلان', 'error');
      });
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="teacher-dashboard">
        {/* Header */}
        <header className="dashboard-header">
          <h1 className="dashboard-title">داشبورد مدرس</h1>
          <p className="dashboard-subtitle">مدیریت محصولات آموزشی و اعلان‌ها</p>
        </header>

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Product Upload Form */}
          <section className="form-section">
            <h2 className="section-title">آپلود محصول جدید</h2>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label className="form-label">عنوان محصول *</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  placeholder="عنوان محصول آموزشی خود را وارد کنید"
                />
              </div>

              <div className="form-group">
                <label className="form-label">توضیحات</label>
                <textarea 
                  rows="4" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input form-textarea"
                  placeholder="توضیحات کاملی از محصول خود ارائه دهید"
                />
              </div>

              <div className="form-group">
                <label className="form-label">قیمت (تومان) *</label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)}
                  className="form-input"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">آپلود فایل (PDF یا ویدیو) *</label>
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files[0])}
                  className="form-input form-file"
                  accept=".pdf,.mp4,.avi,.mov,.wmv"
                />
              </div>

              <button type="submit" className="submit-btn">
                ارسال برای بررسی
              </button>
            </form>
          </section>

          {/* Notifications Section */}
          <section className="notifications-section">
            <h2 className="section-title">اعلان‌های سیستم</h2>
            
            {loadingNotifications ? (
              <div className="loading-text">در حال بارگذاری اعلان‌ها...</div>
            ) : notifications.length === 0 ? (
              <div className="no-notifications">هیچ اعلان جدیدی وجود ندارد</div>
            ) : (
              <ul className="notifications-list">
                {notifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                  >
                    <p className="notification-message">{notification.message}</p>
                    <p className="notification-date">
                      <strong>تاریخ:</strong> {new Date(notification.created_at).toLocaleString('fa-IR')}
                    </p>

                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="mark-read-btn"
                      >
                        علامت‌گذاری به عنوان خوانده‌شده
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default TeacherDashboard;