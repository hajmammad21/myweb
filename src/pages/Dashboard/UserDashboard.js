import React from 'react';

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="dashboard-container" style={{ padding: '2rem', direction: 'rtl' }}>
      <h2>داشبورد کاربر</h2>
      <p>خوش آمدید، {user?.name}!</p>
      <p>ایمیل شما: {user?.email}</p>

      {/* Add more user-specific sections here like courses, etc. */}
    </div>
  );
};

export default UserDashboard;
