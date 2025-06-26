import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../Components/Auth/Auth';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchWithAuth('http://localhost:5000/api/users/admin/all')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div style={{ padding: '2rem', direction: 'rtl', fontFamily: 'Vazirmatn' }}>
      <h3>لیست کاربران</h3>
      {users.length === 0 ? (
        <p>کاربری ثبت نشده است.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={th}>نام</th>
              <th style={th}>ایمیل</th>
              <th style={th}>نقش</th>
              <th style={th}>تاریخ عضویت</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={td}>{u.name}</td>
                <td style={td}>{u.email}</td>
                <td style={td}>
                  {u.is_admin ? 'مدیر' : u.is_teacher ? 'معلم' : 'کاربر'}
                </td>
                <td style={td}>
                    {new Date(u.created_at).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const th = {
  padding: '0.6rem',
  border: '1px solid #ddd',
  fontWeight: 'bold',
};

const td = {
  padding: '0.6rem',
  border: '1px solid #ddd',
};

export default AdminUserList;
