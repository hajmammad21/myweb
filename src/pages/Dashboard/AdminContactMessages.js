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

  return (
    <div style={{ padding: '2rem', direction: 'rtl', fontFamily: 'Vazirmatn' }}>
      <h3>پیام‌های تماس با ما</h3>
      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : messages.length === 0 ? (
        <p>پیامی برای نمایش وجود ندارد.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {messages.map((msg) => (
            <li key={msg.id} style={{ background: '#f9fafb', marginBottom: '1rem', padding: '1rem', borderRadius: '10px' }}>
              <p><strong>نام:</strong> {msg.name}</p>
              <p><strong>ایمیل:</strong> {msg.email}</p>
              <p><strong>زمان ارسال:</strong> {new Date(msg.created_at).toLocaleString('fa-IR')}</p>
              <p><strong>پیام:</strong> {msg.message}</p>
              <button
                className="delete-message-btn"
                onClick={() => {
              if (window.confirm('آیا از حذف این پیام مطمئن هستید؟')) {
                fetchWithAuth(`http://localhost:5000/api/contact/${msg.id}`, {
                method: 'DELETE',
              }).then(() => {
                setMessages((prev) => prev.filter((m) => m.id !== msg.id));
            });
           }
         }}
        >
  حذف از داشبورد
</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminContactMessages;
