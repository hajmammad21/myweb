import React, { useState, useEffect, useMemo } from 'react';
import './SummaryNotes.css';

const SummaryNotes = () => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);

  // Memoize the static data to prevent unnecessary re-renders
  const summaryNotes = useMemo(() => [
    {
      id: 1,
      title: 'جزوه حقوق مدنی - قسمت اول',
      subject: 'حقوق مدنی',
      pages: 45,
      downloadCount: 1250,
      rating: 4.8,
      description: 'خلاصه کامل از مباحث اساسی حقوق مدنی شامل اصول کلی و قوانین مهم',
      uploadDate: '1402/10/15',
      fileSize: '2.5 MB',
      isPremium: false,
      tags: ['حقوق مدنی', 'اصول کلی', 'قوانین']
    },
    {
      id: 2,
      title: 'خلاصه حقوق جزا',
      subject: 'حقوق جزا',
      pages: 38,
      downloadCount: 980,
      rating: 4.6,
      description: 'مرور کامل قوانین جزایی و مجازات‌ها به همراه مثال‌های کاربردی',
      uploadDate: '1402/10/10',
      fileSize: '1.8 MB',
      isPremium: true,
      tags: ['حقوق جزا', 'مجازات', 'قوانین جزایی']
    },
    {
      id: 3,
      title: 'جزوه حقوق تجارت',
      subject: 'حقوق تجارت',
      pages: 52,
      downloadCount: 750,
      rating: 4.7,
      description: 'اصول و قوانین حقوق تجارت، شرکت‌ها و معاملات تجاری',
      uploadDate: '1402/10/08',
      fileSize: '3.1 MB',
      isPremium: false,
      tags: ['حقوق تجارت', 'شرکت‌ها', 'معاملات']
    },
    {
      id: 4,
      title: 'خلاصه حقوق اداری',
      subject: 'حقوق اداری',
      pages: 41,
      downloadCount: 650,
      rating: 4.5,
      description: 'مبانی حقوق اداری، سازمان‌های دولتی و اختیارات آن‌ها',
      uploadDate: '1402/10/05',
      fileSize: '2.2 MB',
      isPremium: true,
      tags: ['حقوق اداری', 'دولت', 'سازمان‌ها']
    },
    {
      id: 5,
      title: 'جزوه حقوق خانواده',
      subject: 'حقوق مدنی',
      pages: 29,
      downloadCount: 1100,
      rating: 4.9,
      description: 'قوانین مربوط به ازدواج، طلاق، نفقه و حضانت فرزندان',
      uploadDate: '1402/10/03',
      fileSize: '1.5 MB',
      isPremium: false,
      tags: ['حقوق خانواده', 'ازدواج', 'طلاق']
    },
    {
      id: 6,
      title: 'خلاصه حقوق بین‌الملل',
      subject: 'حقوق بین‌الملل',
      pages: 67,
      downloadCount: 420,
      rating: 4.4,
      description: 'اصول حقوق بین‌الملل، معاهدات و روابط کشورها',
      uploadDate: '1402/09/28',
      fileSize: '4.2 MB',
      isPremium: true,
      tags: ['حقوق بین‌الملل', 'معاهدات', 'دیپلماسی']
    }
  ], []);

  const subjects = ['all', 'حقوق مدنی', 'حقوق جزا', 'حقوق تجارت', 'حقوق اداری', 'حقوق بین‌الملل'];

  useEffect(() => {
    let filtered = summaryNotes;

    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(note => note.subject === selectedSubject);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredNotes(filtered);
  }, [selectedSubject, searchTerm, summaryNotes]);

  const handleDownload = (noteId, isPremium) => {
    if (isPremium) {
      // Check if user is logged in and has premium access
      // Note: localStorage usage replaced with state-based solution
      const user = null; // Replace with actual user state management
      if (!user) {
        alert('برای دانلود این جزوه باید وارد حساب کاربری خود شوید');
        return;
      }
      // Additional premium check logic here
    }
    
    console.log(`Downloading note with ID: ${noteId}`);
    // Implement actual download logic here
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  return (
    <div className="summary-notes-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">جزوات جمع‌بندی</h1>
          <p className="page-description">
            مجموعه کاملی از جزوات خلاصه و جمع‌بندی دروس حقوق برای مطالعه بهتر و مرور سریع
          </p>
        </div>
      </div>

      <div className="page-container">
        <div className="filters-section">
          <div className="search-filter">
            <div className="search-box">
              <input
                type="text"
                placeholder="جستجو در جزوات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="subject-filter">
            <label htmlFor="subject-select">فیلتر بر اساس موضوع:</label>
            <select
              id="subject-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="subject-select"
            >
              <option value="all">همه موضوعات</option>
              {subjects.slice(1).map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div className="results-count">
            <span>تعداد جزوات یافت شده: {filteredNotes.length}</span>
          </div>
        </div>

        <div className="notes-grid">
          {filteredNotes.length > 0 ? (
            filteredNotes.map(note => (
              <div key={note.id} className="note-card">
                {note.isPremium && (
                  <div className="premium-badge">
                    <span>👑 ویژه</span>
                  </div>
                )}
                
                <div className="note-header">
                  <h3 className="note-title">{note.title}</h3>
                  <div className="note-subject">
                    <span className="subject-badge">{note.subject}</span>
                  </div>
                </div>

                <div className="note-description">
                  <p>{note.description}</p>
                </div>

                <div className="note-tags">
                  {note.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>

                <div className="note-stats">
                  <div className="stat-item">
                    <span className="stat-icon">📄</span>
                    <span>{note.pages} صفحه</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">💾</span>
                    <span>{note.fileSize}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">⬇️</span>
                    <span>{note.downloadCount.toLocaleString()} دانلود</span>
                  </div>
                </div>

                <div className="note-rating">
                  <div className="stars">
                    {renderStars(note.rating)}
                  </div>
                  <span className="rating-value">({note.rating})</span>
                </div>

                <div className="note-footer">
                  <div className="upload-date">
                    <span>تاریخ بارگذاری: {note.uploadDate}</span>
                  </div>
                  <button
                    className={`download-btn ${note.isPremium ? 'premium' : ''}`}
                    onClick={() => handleDownload(note.id, note.isPremium)}
                  >
                    {note.isPremium ? '🔒 دانلود ویژه' : '📥 دانلود رایگان'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <div className="no-results-icon">📚</div>
              <h3>هیچ جزوه‌ای یافت نشد</h3>
              <p>لطفاً فیلترها را تغییر دهید یا عبارت جستجوی دیگری امتحان کنید</p>
            </div>
          )}
        </div>

        <div className="page-info">
          <div className="info-card">
            <h3>درباره جزوات جمع‌بندی</h3>
            <p>
              این جزوات توسط اساتید مجرب و با تجربه تهیه شده و شامل خلاصه‌ای از مهم‌ترین 
              مطالب هر درس می‌باشد. استفاده از این جزوات به شما کمک می‌کند تا در کمترین 
              زمان، بیشترین بازدهی را در مطالعه داشته باشید.
            </p>
            <ul>
              <li>تهیه شده توسط اساتید برتر</li>
              <li>خلاصه و مفید برای مرور سریع</li>
              <li>شامل نکات مهم و کلیدی</li>
              <li>قابل دانلود در فرمت PDF</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryNotes;