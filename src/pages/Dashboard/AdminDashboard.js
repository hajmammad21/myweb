import React, { useState } from 'react';
import './AdminDashboard.css';
import { fetchWithAuth } from '../../Components/Auth/Auth';
import AdminProductReview from './AdminProductReview';
import AdminContactMessages from './AdminContactMessages';
import AdminUserList from './AdminUserList';

const AdminDashboard = () => {
  const [sendToAll, setSendToAll] = useState(false);
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback('');

    const body = {
      user_id: sendToAll ? 'all' : userId,
      message,
    };

    fetchWithAuth('http://localhost:5000/api/users/notifications', {
      method: 'POST',
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg) setFeedback(data.msg);
        else setFeedback('ارسال موفق بود.');
        setMessage('');
        setUserId('');
        setSendToAll(false);
      })
      .catch(() => setFeedback('خطا در ارسال.'));
  };

  return (
    <div className="admin-dashboard">
      <h2>داشبورد مدیر</h2>

      {/* Top row - Notifications and Contact Messages side by side */}
      <div className="admin-top-row">
        <section className="notification-section">
          <h3>ارسال اعلان</h3>
          <div className="notification-form">
            <form onSubmit={handleSubmit}>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="sendToAll"
                  checked={sendToAll}
                  onChange={() => setSendToAll(!sendToAll)}
                />
                <label htmlFor="sendToAll">ارسال به همه کاربران</label>
              </div>

              {!sendToAll && (
                <div>
                  <label htmlFor="userId">شناسه کاربر:</label>
                  <input
                    id="userId"
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                    placeholder="شناسه کاربر را وارد کنید"
                  />
                </div>
              )}

              <div>
                <label htmlFor="message">متن پیام:</label>
                <textarea
                  id="message"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="متن پیام خود را وارد کنید..."
                />
              </div>
              <button type="submit">ارسال اعلان</button>
            </form>
            {feedback && <p className="feedback-msg">{feedback}</p>}
          </div>
        </section>

        <AdminContactMessages />
      </div>

      {/* Product Review Section */}
      <AdminProductReview />

      {/* User List Section */}
      <AdminUserList />
    </div>
  );
};

export default AdminDashboard;