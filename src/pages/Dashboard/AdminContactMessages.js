import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../Components/Auth/Auth';
import './AdminContactMessages.css';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('http://localhost:5000/api/contact')
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const deleteMessage = (msgId) => {
    if (window.confirm('آیا از حذف این پیام مطمئن هستید؟')) {
      fetchWithAuth(`http://localhost:5000/api/contact/${msgId}`, {
        method: 'DELETE',
      }).then(() => {
        setMessages((prev) => prev.filter((m) => m.id !== msgId));
      }).catch(() => {
        alert('خطا در حذف پیام');
      });
    }
  };

  return (
    <section className="contact-messages-section">
      <h3>پیام‌های تماس با ما</h3>
      {loading ? (
        <div className="loading-message">در حال بارگذاری...</div>
      ) : messages.length === 0 ? (
        <div className="no-messages">پیامی برای نمایش وجود ندارد.</div>
      ) : (
        <ul className="contact-messages-list">
          {messages.map((msg) => (
            <li key={msg.id} className="contact-message-item">
              <p><strong>نام:</strong> {msg.name}</p>
              <p><strong>ایمیل:</strong> <span className="user-email">{msg.email}</span></p>
              <p><strong>زمان ارسال:</strong> <span className="user-date">{new Date(msg.created_at).toLocaleString('fa-IR')}</span></p>
              <div className="contact-message-content">
                <strong>پیام:</strong> {msg.message}
              </div>
              <button
                className="delete-message-btn"
                onClick={() => deleteMessage(msg.id)}
              >
                حذف از داشبورد
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AdminContactMessages;