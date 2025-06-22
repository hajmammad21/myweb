import React from 'react';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <p style={{ padding: '2rem' }}>لطفاً ابتدا وارد شوید.</p>;
  }

  return user.is_admin ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;
