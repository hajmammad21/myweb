import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../Components/Auth/Auth';
import './AdminUserList.css';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('http://localhost:5000/api/users/admin/all')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        console.error('خطا در دریافت کاربران');
      });
  }, []);

  const getUserRoleClass = (user) => {
    if (user.is_admin) return 'admin';
    if (user.is_teacher) return 'teacher';
    return 'user';
  };

  const getUserRoleText = (user) => {
    if (user.is_admin) return 'مدیر';
    if (user.is_teacher) return 'معلم';
    return 'کاربر';
  };

  const getStats = () => {
    const totalUsers = users.length;
    const admins = users.filter(u => u.is_admin).length;
    const teachers = users.filter(u => u.is_teacher).length;
    const regularUsers = users.filter(u => !u.is_admin && !u.is_teacher).length;

    return { totalUsers, admins, teachers, regularUsers };
  };

  const stats = getStats();

  if (loading) {
    return (
      <section className="user-list-section">
        <h3>لیست کاربران</h3>
        <div className="loading-message">در حال بارگذاری...</div>
      </section>
    );
  }

  return (
    <section className="user-list-section">
      <h3>لیست کاربران</h3>
      
      {/* Stats Cards */}
      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-label2">کل کاربران</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.admins}</div>
          <div className="stat-label2">مدیران</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.teachers}</div>
          <div className="stat-label2">معلمان</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.regularUsers}</div>
          <div className="stat-label2">کاربران عادی</div>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="no-users">کاربری ثبت نشده است.</div>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>شناسه</th>
              <th>نام</th>
              <th>ایمیل</th>
              <th>نقش</th>
              <th>تاریخ عضویت</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <span className='user_id'>{user.id}</span>
                </td>
                <td>
                  <span className="user-name">{user.name}</span>
                </td>
                <td>
                  <span className="user-email">{user.email}</span>
                </td>
                <td>
                  <span className={`user-role ${getUserRoleClass(user)}`}>
                    {getUserRoleText(user)}
                  </span>
                </td>
                <td>
                  <span className="user-date">
                    {new Date(user.created_at).toLocaleDateString('fa-IR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default AdminUserList;