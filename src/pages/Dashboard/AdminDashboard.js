import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/contact', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    fetchMessages();
  }, [token]);

  return (
    <div className="dashboard-container" style={{ padding: '2rem', direction: 'rtl' }}>
      <h2>داشبورد ادمین</h2>
      <p>مدیر محترم، {user?.name} عزیز خوش آمدید.</p>

      <h3 style={{ marginTop: '2rem' }}>پیام‌های کاربران:</h3>
      {messages.length === 0 ? (
        <p>پیامی یافت نشد.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {messages.map((msg) => (
            <li
              key={msg.id}
              style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '10px',
                background: '#f9f9f9'
              }}
            >
              <p><strong>نام:</strong> {msg.name}</p>
              <p><strong>ایمیل:</strong> {msg.email}</p>
              <p><strong>پیام:</strong> {msg.message}</p>
              <p><strong>تاریخ:</strong> {new Date(msg.created_at).toLocaleString('fa-IR')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
