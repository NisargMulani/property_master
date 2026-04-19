import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Buy', 'Rent', 'New Launch', 'Commercial', 'Plot/Lands', 'Projects'];

export default function SearchSection() {
  const [category, setCategory] = useState('Buy');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  function handleSearch() {
    navigate(`/listings?category=${encodeURIComponent(category)}&search=${encodeURIComponent(searchTerm)}`);
  }

  return (
    <section className="search-section">
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`category-btn${category === cat ? ' active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="search-input-wrap">
        <input
          type="text"
          placeholder="Search by location, city..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn-orange" onClick={handleSearch}>Search</button>
      </div>
    </section>
  );
}
