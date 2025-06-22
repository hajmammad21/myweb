import React, { useState, useEffect } from 'react';
import './MockExams.css';
import toast from 'react-hot-toast';

// Move mockExams outside the component since it's static data
const mockExams = [
  {
    id: 1,
    title: 'آزمون آزمایشی جامع - سری اول',
    description: 'آزمون کامل شامل تمامی رشته های حقوقی',
    questions: 100,
    duration: 180, // minutes
    difficulty: 'hard',
    subject: 'comprehensive',
    participants: 1250,
    averageScore: 65,
    tags: ['جامع', 'پیشرفته', 'کانون وکلا']
  },
  {
    id: 2,
    title: 'آزمون حقوق مدنی - تست سریع',
    description: 'تمرکز بر قوانین مدنی و اجرای احکام',
    questions: 50,
    duration: 90,
    difficulty: 'medium',
    subject: 'civil',
    participants: 890,
    averageScore: 72,
    tags: ['حقوق مدنی', 'متوسط']
  },
  {
    id: 3,
    title: 'آزمون حقوق جزا - سطح مقدماتی',
    description: 'مبانی حقوق جزا و قانون مجازات اسلامی',
    questions: 40,
    duration: 60,
    difficulty: 'easy',
    subject: 'criminal',
    participants: 1500,
    averageScore: 78,
    tags: ['حقوق جزا', 'مبتدی']
  },
  {
    id: 4,
    title: 'آزمون حقوق تجارت و شرکت ها',
    description: 'قوانین تجارت، شرکت های تجاری و ورشکستگی',
    questions: 60,
    duration: 120,
    difficulty: 'hard',
    subject: 'commercial',
    participants: 650,
    averageScore: 58,
    tags: ['حقوق تجارت', 'پیشرفته']
  },
  {
    id: 5,
    title: 'آزمون حقوق اساسی و اداری',
    description: 'قانون اساسی و حقوق اداری ایران',
    questions: 45,
    duration: 75,
    difficulty: 'medium',
    subject: 'constitutional',
    participants: 980,
    averageScore: 69,
    tags: ['حقوق اساسی', 'متوسط']
  },
  {
    id: 6,
    title: 'آزمون آزمایشی جامع - سری دوم',
    description: 'آزمون پیشرفته برای آمادگی نهایی',
    questions: 120,
    duration: 200,
    difficulty: 'hard',
    subject: 'comprehensive',
    participants: 750,
    averageScore: 62,
    tags: ['جامع', 'پیشرفته', 'تخصصی']
  },
  {
    id: 7,
    title: 'آزمون سریع - مرور کلی',
    description: 'مرور سریع تمامی مباحث در زمان محدود',
    questions: 30,
    duration: 45,
    difficulty: 'easy',
    subject: 'comprehensive',
    participants: 2100,
    averageScore: 75,
    tags: ['سریع', 'مرور', 'آسان']
  },
  {
    id: 8,
    title: 'آزمون حقوق خانواده',
    description: 'احوال شخصیه، ازدواج، طلاق و ارث',
    questions: 35,
    duration: 60,
    difficulty: 'medium',
    subject: 'family',
    participants: 1100,
    averageScore: 71,
    tags: ['حقوق خانواده', 'متوسط']
  }
];

const MockExams = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [filteredExams, setFilteredExams] = useState([]);
  const [user, setUser] = useState(null); // Add user state

  // Mock user data for testing (remove this in production)
  const [mockUser] = useState({ name: 'کاربر آزمایشی', id: 1 });

  const subjects = [
    { value: 'all', label: 'همه موضوعات' },
    { value: 'comprehensive', label: 'جامع' },
    { value: 'civil', label: 'حقوق مدنی' },
    { value: 'criminal', label: 'حقوق جزا' },
    { value: 'commercial', label: 'حقوق تجارت' },
    { value: 'constitutional', label: 'حقوق اساسی' },
    { value: 'family', label: 'حقوق خانواده' }
  ];

  const difficulties = [
    { value: 'all', label: 'همه سطوح' },
    { value: 'easy', label: 'آسان' },
    { value: 'medium', label: 'متوسط' },
    { value: 'hard', label: 'سخت' }
  ];

  // Check for user authentication
  useEffect(() => {
    const checkUserAuth = () => {
      try {
        // Try to get user from localStorage, but handle safely
        if (typeof window !== 'undefined' && window.localStorage) {
          const userData = localStorage.getItem('user');
          if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
          } else {
            setUser(null);
          }
        } else {
          // If localStorage is not available, use mock user for testing
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Error checking user authentication:', error);
        // If there's an error, use mock user for testing
        setUser(mockUser);
      }
    };

    checkUserAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkUserAuth();
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [mockUser]);

  useEffect(() => {
    let filtered = mockExams;

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(exam => exam.subject === selectedSubject);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(exam => exam.difficulty === selectedDifficulty);
    }

    setFilteredExams(filtered);
  }, [selectedSubject, selectedDifficulty]); // mockExams is now outside component, so no dependency needed

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'var(--success-color)';
      case 'medium': return 'var(--warning-color)';
      case 'hard': return 'var(--danger-color)';
      default: return 'var(--primary-color)';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'آسان';
      case 'medium': return 'متوسط';
      case 'hard': return 'سخت';
      default: return '';
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} ساعت و ${mins} دقیقه`;
    }
    return `${mins} دقیقه`;
  };

  const handleStartExam = (exam) => {
    // Check if user is logged in
    if (!user) {
      toast.error('برای شرکت در آزمون ابتدا وارد حساب کاربری خود شوید');
      return;
    }

    toast.success(`شروع ${exam.title}`);
    // Here you would navigate to the actual exam interface
    console.log('Starting exam:', exam);
  };

  const handlePreviewExam = (exam) => {
    toast(`پیش‌نمایش ${exam.title}`);
    // Here you would show exam preview
    console.log('Previewing exam:', exam);
  };

  return (
    <div className="mock-exams-page">
      <div className="mock-exams-container">
        {/* Header Section */}
        <header className="mock-exams-header">
          <h1>آزمون های آزمایشی</h1>
          <p>آماده سازی کامل برای آزمون کانون وکلای دادگستری</p>
        </header>

        {/* Stats Section */}
        <div className="exam-stats">
          <div className="stat-card">
            <div className="stat-number">{mockExams.length}</div>
            <div className="stat-label">آزمون آزمایشی</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {mockExams.reduce((sum, exam) => sum + exam.participants, 0).toLocaleString()}
            </div>
            <div className="stat-label">شرکت کننده</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {mockExams.reduce((sum, exam) => sum + exam.questions, 0)}
            </div>
            <div className="stat-label">سوال موجود</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {Math.round(mockExams.reduce((sum, exam) => sum + exam.averageScore, 0) / mockExams.length)}%
            </div>
            <div className="stat-label">میانگین نمرات</div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-container">
            <div className="filter-group">
              <label>موضوع:</label>
              <select 
                value={selectedSubject} 
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="filter-select"
              >
                {subjects.map(subject => (
                  <option key={subject.value} value={subject.value}>
                    {subject.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>سطح دشواری:</label>
              <select 
                value={selectedDifficulty} 
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="filter-select"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-info">
              <span>{filteredExams.length} آزمون یافت شد</span>
            </div>
          </div>
        </div>

        {/* Exams Grid */}
        <div className="exams-grid">
          {filteredExams.map((exam) => (
            <div key={exam.id} className="exam-card">
              <div className="exam-card-header">
                <div className="exam-title-section">
                  <h3 className="exam-title">{exam.title}</h3>
                  <div 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(exam.difficulty) }}
                  >
                    {getDifficultyLabel(exam.difficulty)}
                  </div>
                </div>
                <p className="exam-description">{exam.description}</p>
              </div>

              <div className="exam-info-grid">
                <div className="info-item">
                  <span className="info-icon">📝</span>
                  <span className="info-label">تعداد سوال</span>
                  <span className="info-value">{exam.questions}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">⏱️</span>
                  <span className="info-label">مدت زمان</span>
                  <span className="info-value">{formatDuration(exam.duration)}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">👥</span>
                  <span className="info-label">شرکت کننده</span>
                  <span className="info-value">{exam.participants.toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">📊</span>
                  <span className="info-label">میانگین نمره</span>
                  <span className="info-value">{exam.averageScore}%</span>
                </div>
              </div>

              <div className="exam-tags">
                {exam.tags.map((tag, index) => (
                  <span key={index} className="exam-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="exam-actions">
                <button 
                  className="preview-btn"
                  onClick={() => handlePreviewExam(exam)}
                >
                  پیش‌نمایش
                </button>
                <button 
                  className="start-exam-btn"
                  onClick={() => handleStartExam(exam)}
                >
                  شروع آزمون
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="tips-section">
          <h2>نکات مهم برای آزمون آزمایشی</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">💡</div>
              <h3>آمادگی ذهنی</h3>
              <p>قبل از شروع آزمون، ذهن خود را آرام کنید و محیط مناسبی برای تمرکز فراهم کنید.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">⏰</div>
              <h3>مدیریت زمان</h3>
              <p>زمان خود را به درستی تقسیم کنید و سعی کنید در زمان تعیین شده آزمون را تمام کنید.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📚</div>
              <h3>مرور مطالب</h3>
              <p>پس از پایان آزمون، پاسخ های نادرست خود را بررسی کنید تا از اشتباهات یاد بگیرید.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🎯</div>
              <h3>تمرین مداوم</h3>
              <p>آزمون های آزمایشی را به طور منظم تکرار کنید تا آمادگی خود را افزایش دهید.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockExams;