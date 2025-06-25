import React, { useEffect, useState } from 'react';
import './UserDashboard.css';
import { fetchWithAuth } from '../../Components/Auth/Auth';

// Enhanced Mark as Read Button Component
const MarkAsReadButton = ({ notificationId, onMarkAsRead, isRead = false }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsRead = async () => {
    if (isRead || isLoading) return;
    
    setIsLoading(true);
    try {
      await onMarkAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isRead) {
    return (
      <div className="read-indicator">
        <span className="read-icon">✓</span>
        <span className="read-text">خوانده شده</span>
      </div>
    );
  }

  return (
    <button 
      className={`mark-read-btn ${isLoading ? 'loading' : ''}`}
      onClick={handleMarkAsRead}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <span className="spinner"></span>
          <span>در حال بارگذاری...</span>
        </>
      ) : (
        <>
          <span className="check-icon">✓</span>
          <span>علامت‌گذاری به عنوان خوانده‌شده</span>
        </>
      )}
    </button>
  );
};

const UserDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordMsgType, setPasswordMsgType] = useState('error'); // 'error' or 'success'

  useEffect(() => {
    fetchWithAuth('http://localhost:5000/api/users/notifications')
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Enhanced markAsRead function with error handling
  const markAsRead = async (id) => {
    try {
      const response = await fetchWithAuth(`http://localhost:5000/api/users/notifications/${id}/read`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
      } else {
        throw new Error('Failed to mark as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // You can add error handling here, like showing a toast notification
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordMsgType('error');

    if (newPassword !== confirmPassword) {
      setPasswordMsg('رمزهای جدید یکسان نیستند.');
      setPasswordMsgType('error');
      return;
    }

    fetchWithAuth('http://localhost:5000/api/users/change-password', {
      method: 'PUT',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setPasswordMsg(data.message);
          // Check if it's a success message
          if (data.message.includes('موفق') || data.message.includes('success')) {
            setPasswordMsgType('success');
            // Clear form on success
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
          } else {
            setPasswordMsgType('error');
          }
        } else if (data.msg) {
          setPasswordMsg(data.msg);
          setPasswordMsgType('error');
        }
      })
      .catch(() => {
        setPasswordMsg('خطایی رخ داده است.');
        setPasswordMsgType('error');
      });
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">داشبورد کاربر</h1>
          <p className="welcome-text">
            خوش آمدید، {user?.username || user?.name || user?.email}! 🌟
          </p>
        </div>

        <div className="dashboard-grid">
          {/* Notifications Section */}
          <div className="dashboard-card notifications-section">
            <div className="card-icon">🔔</div>
            <h2 className="section-title">اعلان‌ها</h2>
            
            {loading ? (
              <div className="loading-spinner">در حال بارگذاری</div>
            ) : notifications.length === 0 ? (
              <div className="no-notifications">
                📭 اعلان جدیدی وجود ندارد
              </div>
            ) : (
              <ul className="notifications-list">
                {notifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                  >
                    <span className="notification-content">
                      {notification.message}
                    </span>
                    <MarkAsReadButton
                      notificationId={notification.id}
                      onMarkAsRead={markAsRead}
                      isRead={notification.is_read}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Profile Section */}
          <div className="dashboard-card profile-section">
            <div className="card-icon">🔐</div>
            <h2 className="section-title">تغییر رمز عبور</h2>
            
            <form className="password-form" onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label className="form-label">رمز فعلی:</label>
                <input
                  type="password"
                  className="form-input"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="رمز عبور فعلی خود را وارد کنید"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">رمز جدید:</label>
                <input
                  type="password"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="رمز عبور جدید را وارد کنید"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">تکرار رمز جدید:</label>
                <input
                  type="password"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="رمز عبور جدید را مجدداً وارد کنید"
                  required
                />
              </div>
              
              <button type="submit" className="submit-btn">
                🔄 تغییر رمز عبور
              </button>
              
              {passwordMsg && (
                <div className={`password-message ${passwordMsgType}`}>
                  {passwordMsgType === 'success' ? '✅' : '❌'} {passwordMsg}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;