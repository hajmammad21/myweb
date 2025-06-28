import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../Components/Auth/Auth';

const TeacherDashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState('');

  // State to store notifications
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true); // Loading state for notifications

  // Fetch notifications when the component mounts
  useEffect(() => {
    fetchWithAuth('http://localhost:5000/api/users/teacher/notifications')
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setLoadingNotifications(false);
      })
      .catch(() => {
        setLoadingNotifications(false);
      });
  }, []);

  // Handle product submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');

    if (!title || !file || !price) {
      setFeedback('لطفاً تمام فیلدها را پر کنید.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('file', file);

    try {
      const res = await fetchWithAuth('http://localhost:5000/api/users/teacher/products', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setFeedback(data.msg || 'محصول با موفقیت ارسال شد.');
      setTitle('');
      setDescription('');
      setPrice('');
      setFile(null);
    } catch (err) {
      setFeedback('خطا در ارسال محصول.');
    }
  };

  // Mark notification as read
  const markAsRead = (id) => {
    fetchWithAuth(`http://localhost:5000/api/users/notifications/${id}/read`, {
      method: 'PUT',
    })
      .then((res) => res.json())
      .then(() => {
        // Update state to reflect the read status
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      })
      .catch((err) => console.error('Error marking as read:', err));
  };

  return (
    <div style={{ padding: '2rem', direction: 'rtl', fontFamily: 'Vazirmatn' }}>
      <h2>داشبورد مدرس</h2>

      {/* Product upload form */}
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>عنوان محصول</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>توضیحات</label>
        <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>قیمت (تومان)</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

        <label>آپلود فایل (PDF یا ویدیو)</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />

        <button type="submit">ارسال برای بررسی</button>
      </form>

      {/* Feedback message */}
      {feedback && <p style={{ marginTop: '1rem', color: 'green', fontWeight: 'bold' }}>{feedback}</p>}

      {/* Notifications Section */}
      <section style={{ marginTop: '2rem' }}>
        <h3>اعلانات</h3>
        {loadingNotifications ? (
          <p>در حال بارگذاری اعلان‌ها...</p>
        ) : notifications.length === 0 ? (
          <p>هیچ اعلان جدیدی وجود ندارد.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {notifications.map((n) => (
              <li key={n.id} style={{ background: '#f9fafb', marginBottom: '1rem', padding: '1rem', borderRadius: '10px' }}>
                <p>{n.message}</p>
                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                  <strong>تاریخ:</strong> {new Date(n.created_at).toLocaleString('fa-IR')}
                </p>

                {/* Mark as Read Button */}
                {!n.is_read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    style={{
                      padding: '0.4rem 1rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    مارک به عنوان خوانده‌شده
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default TeacherDashboard;
