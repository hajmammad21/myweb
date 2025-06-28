import React, { useState } from 'react';
import { fetchWithAuth } from '../../Components/Auth/Auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');

    if (!email) {
      setFeedback('لطفاً ایمیل خود را وارد کنید.');
      return;
    }

    try {
      const res = await fetchWithAuth('http://localhost:5000/api/users/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      setFeedback(data.msg || 'لینک ریست رمز عبور به ایمیل شما ارسال شد.');
    } catch (err) {
      setFeedback('خطا در ارسال درخواست.');
    }
  };

  return (
    <div style={{ padding: '2rem', direction: 'rtl', fontFamily: 'Vazirmatn' }}>
      <h2>بازیابی رمز عبور</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label htmlFor="email">ایمیل</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="ایمیل خود را وارد کنید"
        />
        <button type="submit">ارسال لینک ریست</button>
      </form>
      {feedback && <p style={{ marginTop: '1rem', color: 'green', fontWeight: 'bold' }}>{feedback}</p>}
    </div>
  );
};

export default ForgotPassword;
