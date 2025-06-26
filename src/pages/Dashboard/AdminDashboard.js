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
      })
      .catch(() => setFeedback('خطا در ارسال.'));
  };

  return (
    <div className="admin-dashboard">
      <h2>داشبورد مدیر</h2>

      <section className="notification-form">
        <h3>ارسال اعلان</h3>
        <form onSubmit={handleSubmit}>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={sendToAll}
                onChange={() => setSendToAll(!sendToAll)}
              />
              ارسال به همه کاربران
            </label>
          </div>

          {!sendToAll && (
            <div>
              <label>شناسه کاربر:</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label>متن پیام:</label>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <button type="submit">ارسال اعلان</button>
        </form>
        {feedback && <p className="feedback-msg">{feedback}</p>}
      </section>
      <AdminProductReview />
      <AdminContactMessages />
      <AdminUserList />
    </div>
  );
};

export default AdminDashboard;
