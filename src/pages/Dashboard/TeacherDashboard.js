import React, { useState } from 'react';
import { fetchWithAuth } from '../../Components/Auth/Auth';

const TeacherDashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState('');

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

  return (
    <div style={{ padding: '2rem', direction: 'rtl', fontFamily: 'Vazirmatn' }}>
      <h2>داشبورد مدرس</h2>
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
      {feedback && <p style={{ marginTop: '1rem', color: 'green', fontWeight: 'bold' }}>{feedback}</p>}
    </div>
  );
};

export default TeacherDashboard;
