import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const [isTestsDropdownOpen, setIsTestsDropdownOpen] = useState(false);
  const [isLearningDropdownOpen, setIsLearningDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (item, href) => {
    setActiveItem(item);
    if (item === 'Home') {
      navigate('/');
    } else if (href) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleTestsHover = (isHovering) => {
    setIsTestsDropdownOpen(isHovering);
  };

  const handleLearningHover = (isHovering) => {
    setIsLearningDropdownOpen(isHovering);
  };

  const handleDropdownItemClick = (item) => {
    if (item.includes('تست') || item.includes('آزمون')) {
      setActiveItem('Tests');
    } else if (item.includes('تدریسی') || item.includes('جزوات')) {
      setActiveItem('Learning Room');
    }
    setIsTestsDropdownOpen(false);
    setIsLearningDropdownOpen(false);
    
    // Navigate to TestPage for the first test option
    if (item === 'تست های دروس') {
      navigate('/test-page');
    } else {
      console.log(`Navigating to: ${item}`);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <h2 className="logo" onClick={() => handleNavClick('Home', '#home')}>
            شرکت حقوقی
          </h2>
        </div>

        <nav className="nav-menu">
          <ul className="nav-list">
            <li className="nav-item">
              <a
                href="#home"
                className={`nav-link ${activeItem === 'Home' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('Home', '#home');
                }}
              >
                خانه
              </a>
            </li>

            <li
              className="nav-item dropdown-container"
              onMouseEnter={() => handleTestsHover(true)}
              onMouseLeave={() => handleTestsHover(false)}
            >
              <a
                href="#tests"
                className={`nav-link ${activeItem === 'Tests' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('Tests', '#tests');
                }}
              >
                آزمون ها
                <span className="dropdown-arrow">▼</span>
              </a>

              <div className={`dropdown-menu ${isTestsDropdownOpen ? 'show' : ''}`}>
                <a
                  href="#subject-tests"
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDropdownItemClick('تست های دروس');
                  }}
                >
                  تست های دروس
                </a>
                <a
                  href="#past-exams"
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDropdownItemClick('آزمون های سال های گذشته');
                  }}
                >
                  آزمون های سال های گذشته
                </a>
                <a
                  href="#mock-exams"
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDropdownItemClick('آزمون های آزمایشی');
                  }}
                >
                  آزمون های آزمایشی
                </a>
              </div>
            </li>

            <li
              className="nav-item dropdown-container"
              onMouseEnter={() => handleLearningHover(true)}
              onMouseLeave={() => handleLearningHover(false)}
            >
              <a
                href="#learning"
                className={`nav-link ${activeItem === 'Learning Room' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('Learning Room', '#learning');
                }}
              >
                اتاق مطالعه
                <span className="dropdown-arrow">▼</span>
              </a>

              <div className={`dropdown-menu ${isLearningDropdownOpen ? 'show' : ''}`}>
                <a
                  href="#lessons-pdfs"
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDropdownItemClick('تدریسی ها و پی دی اف کتب');
                  }}
                >
                  تدریسی ها و پی دی اف کتب
                </a>
                <a
                  href="#summary-notes"
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDropdownItemClick('جزوات جمع بندی');
                  }}
                >
                  جزوات جمع بندی
                </a>
              </div>
            </li>

            <li className="nav-item">
              <a
                href="#vip"
                className={`nav-link ${activeItem === 'VIP Section' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('VIP Section', '#vip');
                }}
              >
                دوره های خصوصی
              </a>
            </li>

            <li className="nav-item">
              <a
                href="#contact"
                className={`nav-link ${activeItem === 'Contact Us' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('Contact Us', '#contact');
                }}
              >
                تماس با ما
              </a>
            </li>
          </ul>
        </nav>

        <div className="auth-section">
          <button
            className="auth-btn"
            onClick={() => navigate('/auth')}
          >
            ورود/ثبت نام
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;