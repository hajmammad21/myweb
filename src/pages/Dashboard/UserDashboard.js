import React, { useEffect, useState } from 'react';
import './UserDashboard.css';

const UserDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/users/notifications', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      });
  }, [token]);

  const markAsRead = (id) => {
    fetch(`http://localhost:5000/api/users/notifications/${id}/read`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    });
  };

  return (
    <div className="user-dashboard">
      <h2>داشبورد کاربر</h2>
      <p>خوش آمدید، {user?.username || user?.email}!</p>

      <section className="notifications-section">
        <h3>اعلان‌ها</h3>
        {loading ? (
          <p>در حال بارگذاری...</p>
        ) : notifications.length === 0 ? (
          <p>اعلان جدیدی وجود ندارد.</p>
        ) : (
          <ul>
            {notifications.map((n) => (
              <li key={n.id} className={n.is_read ? 'read' : 'unread'}>
                <span>{n.message}</span>
                {!n.is_read && (
                  <button onClick={() => markAsRead(n.id)}>علامت‌گذاری به عنوان خوانده‌شده</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="profile-section">
        <h3>تغییر رمز عبور</h3>
        <form
  onSubmit={(e) => {
    e.preventDefault();
    setPasswordMsg('');

    if (newPassword !== confirmPassword) {
      setPasswordMsg('رمزهای جدید یکسان نیستند.');
      return;
    }

    fetch('http://localhost:5000/api/users/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setPasswordMsg(data.message);
        } else if (data.msg) {
          setPasswordMsg(data.msg);
        }
      })
      .catch(() => {
        setPasswordMsg('خطایی رخ داده است.');
      });
  }}
>
  <div>
    <label>رمز فعلی:</label>
    <input
      type="password"
      value={oldPassword}
      onChange={(e) => setOldPassword(e.target.value)}
      required
    />
  </div>
  <div>
    <label>رمز جدید:</label>
    <input
      type="password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      required
    />
  </div>
  <div>
    <label>تکرار رمز جدید:</label>
    <input
      type="password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
    />
  </div>
  <button type="submit">تغییر رمز عبور</button>
  {passwordMsg && <p className="password-msg">{passwordMsg}</p>}
</form>

      </section>
    </div>
  );
};

export default UserDashboard;
