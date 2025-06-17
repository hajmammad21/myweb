import React from 'react';
import './Courses.css';

const courses = [
  {
    title: 'طراحی وب مدرن',
    duration: '۸ هفته',
    students: '۴۵۰',
    price: '۲,۵۰۰,۰۰۰ تومان',
    features: ['HTML', 'CSS', 'JavaScript', 'React', 'Responsive Design']
  },
  {
    title: 'آموزش برنامه‌نویسی پایتون',
    duration: '۶ هفته',
    students: '۵۸۰',
    price: '۲,۰۰۰,۰۰۰ تومان',
    features: ['Syntax', 'OOP', 'Data Analysis', 'Web Scraping', 'Flask']
  },
  {
    title: 'دوره جامع UI/UX',
    duration: '۱۰ هفته',
    students: '۳۰۰',
    price: '۳,۲۰۰,۰۰۰ تومان',
    features: ['Figma', 'User Research', 'Wireframes', 'Prototyping', 'Design Thinking']
  },
];

const Courses = () => {
  return (
    <section className="courses-section" id="courses">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">دوره‌های پرطرفدار</h2>
          <p className="section-description">
            مجموعه‌ای از دوره‌های کاربردی برای ورود حرفه‌ای به بازار کار.
          </p>
        </div>
        <div className="courses-grid">
          {courses.map((course, index) => (
            <div className="course-card" key={index}>
              <div className="course-header">
                <h3 className="course-title">{course.title}</h3>
                <div className="course-meta">
                  <div className="course-duration">⏱ {course.duration}</div>
                  <div className="course-students">👥 {course.students} نفر</div>
                </div>
              </div>
              <div className="course-body">
                <div className="course-price">{course.price}</div>
                <ul className="course-features">
                  {course.features.map((feature, idx) => (
                    <li className="course-feature" key={idx}>
                      <span className="feature-check">✔</span> {feature}
                    </li>
                  ))}
                </ul>
                <button className="course-btn">ثبت‌نام در دوره</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
