import './PastExams.css';
import toast from 'react-hot-toast';

const PastExams = () => {

  const examYears = [
    {
      year: '1403',
      title: 'آزمون های سال 1403',
      description: 'جدیدترین آزمون های کانون وکلای دادگستری',
      exams: ['آزمون بهمن 1403', 'آزمون آذر 1403', 'آزمون مهر 1403']
    },
    {
      year: '1402',
      title: 'آزمون های سال 1402',
      description: 'مجموعه کامل آزمون های سال 1402',
      exams: ['آزمون اسفند 1402', 'آزمون بهمن 1402', 'آزمون دی 1402', 'آزمون آذر 1402']
    },
    {
      year: '1401',
      title: 'آزمون های سال 1401',
      description: 'آزمون های سال 1401 با پاسخ تشریحی',
      exams: ['آزمون اسفند 1401', 'آزمون بهمن 1401', 'آزمون دی 1401', 'آزمون آذر 1401']
    },
    {
      year: '1400',
      title: 'آزمون های سال 1400',
      description: 'آرشیو کامل آزمون های سال 1400',
      exams: ['آزمون اسفند 1400', 'آزمون بهمن 1400', 'آزمون دی 1400', 'آزمون آذر 1400']
    },
    {
      year: '1399',
      title: 'آزمون های سال 1399',
      description: 'مجموعه آزمون های سال 1399',
      exams: ['آزمون اسفند 1399', 'آزمون بهمن 1399', 'آزمون دی 1399', 'آزمون آذر 1399']
    },
    {
      year: '1398',
      title: 'آزمون های سال 1398',
      description: 'آرشیو آزمون های سال 1398',
      exams: ['آزمون اسفند 1398', 'آزمون بهمن 1398', 'آزمون دی 1398', 'آزمون آذر 1398']
    }
  ];

  const handleExamClick = (examName, year) => {
    toast(`شروع ${examName} از سال ${year}`);
  };

  return (
    <div className="past-exams-page">
      <div className="past-exams-container">
        <header className="past-exams-header">
          <h1>آزمون های سال های گذشته</h1>
          <p>دسترسی به آرشیو کامل آزمون های کانون وکلای دادگستری</p>
        </header>
        
        <div className="years-grid">
          {examYears.map((yearData) => (
            <div key={yearData.year} className="year-card">
              <div className="year-card-header">
                <h3>{yearData.title}</h3>
                <p>{yearData.description}</p>
              </div>
              
              <div className="exams-list">
                {yearData.exams.map((exam, index) => (
                  <div key={index} className="exam-item">
                    <div className="exam-info">
                      <span className="exam-name">{exam}</span>
                      <span className="exam-details">
                        {yearData.exams.length > 3 ? '4 آزمون' : `${yearData.exams.length} آزمون`}
                      </span>
                    </div>
                    <button 
                      className="take-exam-btn"
                      onClick={() => handleExamClick(exam, yearData.year)}
                    >
                      شروع آزمون
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="year-card-footer">
                <button className="view-all-btn">
                  مشاهده همه آزمون های {yearData.year}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="exam-stats">
          <div className="stat-card">
            <div className="stat-number">250+</div>
            <div className="stat-label">آزمون موجود</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">6</div>
            <div className="stat-label">سال آرشیو</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">15000+</div>
            <div className="stat-label">سوال</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastExams;