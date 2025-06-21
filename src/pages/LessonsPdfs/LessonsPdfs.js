import React, { useState, useEffect } from 'react';
import './LessonsPdfs.css';
import toast from 'react-hot-toast';

const LessonsPdfs = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPdfs, setFilteredPdfs] = useState([]);
  const [user, setUser] = useState(null);

  // Mock user data for testing
  const [mockUser] = useState({ name: 'کاربر آزمایشی', id: 1 });

  const lessonPdfs = [
    {
      id: 1,
      title: 'مبانی حقوق مدنی - جلد اول',
      description: 'شامل کلیات حقوق مدنی، اشخاص و اموال',
      category: 'civil',
      level: 'beginner',
      pages: 245,
      size: '8.5 MB',
      downloads: 1850,
      rating: 4.8,
      author: 'دکتر احمد محمدی',
      publishDate: '1402/10/15',
      tags: ['اشخاص', 'اموال', 'مبانی'],
      previewUrl: '/pdfs/civil-law-vol1-preview.pdf',
      downloadUrl: '/pdfs/civil-law-vol1.pdf'
    },
    {
      id: 2,
      title: 'حقوق جزای عمومی - کامل',
      description: 'تمامی مباحث حقوق جزای عمومی و قانون مجازات اسلامی',
      category: 'criminal',
      level: 'intermediate',
      pages: 320,
      size: '12.3 MB',
      downloads: 2100,
      rating: 4.9,
      author: 'دکتر مریم رضایی',
      publishDate: '1402/11/20',
      tags: ['جرم', 'مجازات', 'عمومی'],
      previewUrl: '/pdfs/criminal-law-preview.pdf',
      downloadUrl: '/pdfs/criminal-law.pdf'
    },
    {
      id: 3,
      title: 'حقوق تجارت و شرکت‌ها',
      description: 'قوانین تجارت، انواع شرکت‌ها و ورشکستگی',
      category: 'commercial',
      level: 'advanced',
      pages: 180,
      size: '6.8 MB',
      downloads: 950,
      rating: 4.6,
      author: 'دکتر علی حسینی',
      publishDate: '1402/09/10',
      tags: ['شرکت', 'تجارت', 'ورشکستگی'],
      previewUrl: '/pdfs/commercial-law-preview.pdf',
      downloadUrl: '/pdfs/commercial-law.pdf'
    },
    {
      id: 4,
      title: 'حقوق اساسی ایران',
      description: 'قانون اساسی جمهوری اسلامی ایران و تفسیر آن',
      category: 'constitutional',
      level: 'intermediate',
      pages: 210,
      size: '7.2 MB',
      downloads: 1650,
      rating: 4.7,
      author: 'دکتر سارا احمدی',
      publishDate: '1402/08/25',
      tags: ['قانون اساسی', 'حقوق بشر', 'نظام سیاسی'],
      previewUrl: '/pdfs/constitutional-law-preview.pdf',
      downloadUrl: '/pdfs/constitutional-law.pdf'
    },
    {
      id: 5,
      title: 'آیین دادرسی مدنی - جامع',
      description: 'مراحل دادرسی مدنی از طرح دعوا تا اجرای حکم',
      category: 'procedure',
      level: 'advanced',
      pages: 290,
      size: '10.5 MB',
      downloads: 1420,
      rating: 4.8,
      author: 'دکتر محمد کریمی',
      publishDate: '1402/12/05',
      tags: ['دادرسی', 'دعوا', 'اجرای احکام'],
      previewUrl: '/pdfs/civil-procedure-preview.pdf',
      downloadUrl: '/pdfs/civil-procedure.pdf'
    },
    {
      id: 6,
      title: 'حقوق خانواده و احوال شخصیه',
      description: 'ازدواج، طلاق، نفقه، حضانت و مسائل خانواده',
      category: 'family',
      level: 'beginner',
      pages: 150,
      size: '5.4 MB',
      downloads: 2250,
      rating: 4.9,
      author: 'دکتر فاطمه موسوی',
      publishDate: '1402/07/12',
      tags: ['ازدواج', 'طلاق', 'نفقه', 'حضانت'],
      previewUrl: '/pdfs/family-law-preview.pdf',
      downloadUrl: '/pdfs/family-law.pdf'
    },
    {
      id: 7,
      title: 'قانون کار و تامین اجتماعی',
      description: 'روابط کار، حقوق کارگران و قوانین تامین اجتماعی',
      category: 'labor',
      level: 'intermediate',
      pages: 195,
      size: '7.8 MB',
      downloads: 1100,
      rating: 4.5,
      author: 'دکتر رضا نوری',
      publishDate: '1402/06/18',
      tags: ['کار', 'تامین اجتماعی', 'کارگر'],
      previewUrl: '/pdfs/labor-law-preview.pdf',
      downloadUrl: '/pdfs/labor-law.pdf'
    },
    {
      id: 8,
      title: 'حقوق بین‌الملل عمومی',
      description: 'اصول و قواعد حقوق بین‌الملل و روابط دیپلماتیک',
      category: 'international',
      level: 'advanced',
      pages: 275,
      size: '9.7 MB',
      downloads: 780,
      rating: 4.4,
      author: 'دکتر امیر قاسمی',
      publishDate: '1402/05/30',
      tags: ['بین‌الملل', 'دیپلماسی', 'معاهدات'],
      previewUrl: '/pdfs/international-law-preview.pdf',
      downloadUrl: '/pdfs/international-law.pdf'
    }
  ];

  const categories = [
    { value: 'all', label: 'همه دسته‌ها' },
    { value: 'civil', label: 'حقوق مدنی' },
    { value: 'criminal', label: 'حقوق جزا' },
    { value: 'commercial', label: 'حقوق تجارت' },
    { value: 'constitutional', label: 'حقوق اساسی' },
    { value: 'procedure', label: 'آیین دادرسی' },
    { value: 'family', label: 'حقوق خانواده' },
    { value: 'labor', label: 'حقوق کار' },
    { value: 'international', label: 'حقوق بین‌الملل' }
  ];

  const levels = [
    { value: 'all', label: 'همه سطوح' },
    { value: 'beginner', label: 'مقدماتی' },
    { value: 'intermediate', label: 'متوسط' },
    { value: 'advanced', label: 'پیشرفته' }
  ];

  // Check for user authentication
  useEffect(() => {
    const checkUserAuth = () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const userData = localStorage.getItem('user');
          if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
          } else {
            setUser(null);
          }
        } else {
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Error checking user authentication:', error);
        setUser(mockUser);
      }
    };

    checkUserAuth();

    const handleAuthChange = () => {
      checkUserAuth();
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [mockUser]);

  // Filter PDFs based on selected filters and search term
  useEffect(() => {
    let filtered = lessonPdfs;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(pdf => pdf.category === selectedCategory);
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(pdf => pdf.level === selectedLevel);
    }

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(pdf =>
        pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdf.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdf.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPdfs(filtered);
  }, [selectedCategory, selectedLevel, searchTerm]);

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'var(--success-color)';
      case 'intermediate': return 'var(--warning-color)';
      case 'advanced': return 'var(--danger-color)';
      default: return 'var(--primary-color)';
    }
  };

  const getLevelLabel = (level) => {
    switch (level) {
      case 'beginner': return 'مقدماتی';
      case 'intermediate': return 'متوسط';
      case 'advanced': return 'پیشرفته';
      default: return '';
    }
  };

  const handleDownload = (pdf) => {
    if (!user) {
      toast.error('برای دانلود PDF ابتدا وارد حساب کاربری خود شوید');
      return;
    }

    toast.success(`شروع دانلود: ${pdf.title}`);
    // Here you would handle the actual download
    console.log('Downloading PDF:', pdf);
    
    // Simulate download
    const link = document.createElement('a');
    link.href = pdf.downloadUrl;
    link.download = pdf.title + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (pdf) => {
    toast(`پیش‌نمایش: ${pdf.title}`);
    // Here you would open the PDF preview
    console.log('Previewing PDF:', pdf);
    window.open(pdf.previewUrl, '_blank');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
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
    <div className="lessons-pdfs-page">
      <div className="lessons-pdfs-container">
        {/* Header Section */}
        <header className="lessons-pdfs-header">
          <h1>کتاب‌ها و جزوات درسی</h1>
          <p>مجموعه کاملی از منابع آموزشی برای تسلط بر حقوق</p>
        </header>

        {/* Stats Section */}
        <div className="pdf-stats">
          <div className="stat-card">
            <div className="stat-number">{lessonPdfs.length}</div>
            <div className="stat-label">کتاب موجود</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {lessonPdfs.reduce((sum, pdf) => sum + pdf.downloads, 0).toLocaleString()}
            </div>
            <div className="stat-label">دانلود انجام شده</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {lessonPdfs.reduce((sum, pdf) => sum + pdf.pages, 0).toLocaleString()}
            </div>
            <div className="stat-label">صفحه آموزشی</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {(lessonPdfs.reduce((sum, pdf) => sum + pdf.rating, 0) / lessonPdfs.length).toFixed(1)}
            </div>
            <div className="stat-label">میانگین امتیاز</div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="search-filters-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="جستجو در کتاب‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filters-container">
            <div className="filter-group">
              <label>دسته‌بندی:</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>سطح:</label>
              <select 
                value={selectedLevel} 
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="filter-select"
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-info">
              <span>{filteredPdfs.length} کتاب یافت شد</span>
            </div>
          </div>
        </div>

        {/* PDFs Grid */}
        <div className="pdfs-grid">
          {filteredPdfs.map((pdf) => (
            <div key={pdf.id} className="pdf-card">
              <div className="pdf-card-header">
                <div className="pdf-title-section">
                  <h3 className="pdf-title">{pdf.title}</h3>
                  <div 
                    className="level-badge"
                    style={{ backgroundColor: getLevelColor(pdf.level) }}
                  >
                    {getLevelLabel(pdf.level)}
                  </div>
                </div>
                <p className="pdf-description">{pdf.description}</p>
                <div className="pdf-author">نویسنده: {pdf.author}</div>
              </div>

              <div className="pdf-info-grid">
                <div className="info-item">
                  <span className="info-icon">📄</span>
                  <span className="info-label">تعداد صفحه</span>
                  <span className="info-value">{pdf.pages}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">💾</span>
                  <span className="info-label">حجم فایل</span>
                  <span className="info-value">{pdf.size}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">⬇️</span>
                  <span className="info-label">دانلود</span>
                  <span className="info-value">{pdf.downloads.toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">📅</span>
                  <span className="info-label">انتشار</span>
                  <span className="info-value">{pdf.publishDate}</span>
                </div>
              </div>

              <div className="pdf-rating">
                <div className="rating-stars">
                  {renderStars(pdf.rating)}
                </div>
                <span className="rating-number">{pdf.rating}</span>
              </div>

              <div className="pdf-tags">
                {pdf.tags.map((tag, index) => (
                  <span key={index} className="pdf-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pdf-actions">
                <button 
                  className="preview-btn"
                  onClick={() => handlePreview(pdf)}
                >
                  پیش‌نمایش
                </button>
                <button 
                  className="download-btn"
                  onClick={() => handleDownload(pdf)}
                >
                  دانلود کتاب
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Study Tips Section */}
        <div className="study-tips-section">
          <h2>راهنمای مطالعه مؤثر</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">📖</div>
              <h3>مطالعه منظم</h3>
              <p>هر روز زمان مشخصی را برای مطالعه اختصاص دهید و از آن پیروی کنید.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">✏️</div>
              <h3>یادداشت‌برداری</h3>
              <p>نکات مهم را یادداشت کنید و خلاصه‌های مفیدی از مطالب تهیه کنید.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🔄</div>
              <h3>مرور مداوم</h3>
              <p>مطالب خوانده شده را به طور منظم مرور کنید تا در حافظه بماند.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">💡</div>
              <h3>تست و تمرین</h3>
              <p>پس از مطالعه هر بخش، تست‌های مربوطه را حل کنید.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonsPdfs;