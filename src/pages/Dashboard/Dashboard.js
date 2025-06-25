import React from 'react';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import TeacherDashboard from './TeacherDashboard';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <p style={{ padding: '2rem' }}>لطفاً ابتدا وارد شوید.</p>;
  }

  if (user.is_admin) return <AdminDashboard />;
  if (user.is_teacher) return <TeacherDashboard />;

  return <UserDashboard />;
};

export default Dashboard;
