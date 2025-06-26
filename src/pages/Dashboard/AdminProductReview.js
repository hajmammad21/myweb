import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../Components/Auth/Auth';
import './AdminProductReview.css';

const AdminProductReview = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    fetchWithAuth('http://localhost:5000/api/users/admin/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => {
        console.error('خطا در دریافت محصولات');
      });
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
        setCategories(prev => {
          const newCategories = { ...prev };
          delete newCategories[id];
          return newCategories;
        });
      })
      .catch(() => {
        alert('خطا در تایید محصول');
      });
  };

  return (
    <section className="product-review-section">
      <h3>محصولات در انتظار تایید</h3>
      {products.length === 0 ? (
        <div className="no-products">محصولی برای بررسی وجود ندارد.</div>
      ) : (
        <ul className="products-list">
          {products.map((p) => (
            <li key={p.id} className="product-item">
              <div className="product-status">در انتظار تایید</div>
              <h4>{p.title}</h4>
              <p>{p.description}</p>
              <div className="product-price">قیمت: {p.price} تومان</div>
              <a 
                href={p.file_url} 
                target="_blank" 
                rel="noreferrer"
                className="product-file-link"
              >
                دانلود فایل
              </a>

              <div className="category-selection">
                <label htmlFor={`category-${p.id}`}>انتخاب دسته‌بندی:</label>
                <select
                  id={`category-${p.id}`}
                  value={categories[p.id] || ''}
                  onChange={(e) => handleCategoryChange(p.id, e.target.value)}
                >
                  <option value="">-- انتخاب کنید --</option>
                  <option value="summary-notes">جزوات جمع‌بندی</option>
                  <option value="lessons-pdfs">تدریسی‌ها و پی‌دی‌اف‌ها</option>
                  <option value="past-exams">آزمون‌های گذشته</option>
                </select>
              </div>

              <button
                onClick={() => approveProduct(p.id)}
                className="approve-btn"
              >
                تایید محصول
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AdminProductReview;