import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../Components/Auth/Auth';

const AdminProductReview = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    fetchWithAuth('http://localhost:5000/api/users/admin/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleCategoryChange = (id, value) => {
    setCategories(prev => ({ ...prev, [id]: value }));
  };

  const approveProduct = (id) => {
    const category = categories[id];

    if (!category) {
      alert('لطفاً یک دسته‌بندی انتخاب کنید.');
      return;
    }

    fetchWithAuth(`http://localhost:5000/api/users/admin/products/${id}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
    })
      .then((res) => res.json())
      .then(() => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      });
  };

  return (
    <div style={{ padding: '2rem', direction: 'rtl', fontFamily: 'Vazirmatn' }}>
      <h3>محصولات در انتظار تایید</h3>
      {products.length === 0 ? (
        <p>محصولی برای بررسی وجود ندارد.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {products.map((p) => (
            <li key={p.id} style={{ background: '#f8fafc', marginBottom: '1rem', padding: '1rem', borderRadius: '10px' }}>
              <h4>{p.title}</h4>
              <p>{p.description}</p>
              <p>قیمت: {p.price} تومان</p>
              <a href={p.file_url} target="_blank" rel="noreferrer">دانلود فایل</a>

              <div style={{ marginTop: '1rem' }}>
                <label htmlFor={`category-${p.id}`}>انتخاب دسته‌بندی:</label>
                <select
                  id={`category-${p.id}`}
                  value={categories[p.id] || ''}
                  onChange={(e) => handleCategoryChange(p.id, e.target.value)}
                  style={{ marginRight: '1rem', padding: '0.4rem' }}
                >
                  <option value="">-- انتخاب --</option>
                  <option value="summary-notes">جزوات جمع‌بندی</option>
                  <option value="lessons-pdfs">تدریسی‌ها و پی‌دی‌اف‌ها</option>
                  <option value="past-exams">آزمون‌های گذشته</option>
                </select>
              </div>

              <button
                onClick={() => approveProduct(p.id)}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                تایید محصول
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminProductReview;
