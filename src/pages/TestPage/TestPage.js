import React from 'react';
import './TestPage.css';

const TestPage = () => {
  return (
    <div className="test-page">
      <div className="test-page-container">
        <header className="test-page-header">
          <h1>تست های دروس</h1>
          <p>در این بخش می‌توانید تست‌های مختلف دروس را انجام دهید</p>
        </header>
        
        <div className="test-categories">
          <div className="test-category-card">
            <h3>حقوق مدنی</h3>
            <p>تست‌های مربوط به حقوق مدنی</p>
            <button className="start-test-btn">شروع تست</button>
          </div>
          
          <div className="test-category-card">
            <h3>حقوق جزا</h3>
            <p>تست‌های مربوط به حقوق جزا</p>
            <button className="start-test-btn">شروع تست</button>
          </div>
          
          <div className="test-category-card">
            <h3>حقوق تجارت</h3>
            <p>تست‌های مربوط به حقوق تجارت</p>
            <button className="start-test-btn">شروع تست</button>
          </div>
          
          <div className="test-category-card">
            <h3>حقوق اساسی</h3>
            <p>تست‌های مربوط به حقوق اساسی</p>
            <button className="start-test-btn">شروع تست</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;