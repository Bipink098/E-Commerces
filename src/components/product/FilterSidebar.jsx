import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { categories, brands } from '../../data/products';
import { Rating } from './ProductCard';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, resultCount }) => {
  const priceRanges = [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $250', min: 100, max: 250 },
    { label: '$250 - $500', min: 250, max: 500 },
    { label: 'Over $500', min: 500, max: Infinity },
  ];

  const ratingOptions = [4, 3, 2, 1];

  const colorSwatches = [
    { name: 'Black', hex: '#1a1a1a' },
    { name: 'White', hex: '#f5f5f5' },
    { name: 'Navy', hex: '#1e3a5f' },
    { name: 'Red', hex: '#e53e3e' },
    { name: 'Blue', hex: '#3182ce' },
    { name: 'Green', hex: '#38a169' },
    { name: 'Silver', hex: '#a0aec0' },
    { name: 'Gold', hex: '#d69e2e' },
  ];

  return (
    <aside className="filter-sidebar" aria-label="Product filters">
      <div className="filter-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SlidersHorizontal size={16} /> Filters
        </span>
        {Object.values(filters).some(v => v !== null && v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)) && (
          <button
            className="btn-ghost btn-sm"
            onClick={onClearFilters}
            style={{ color: 'var(--color-accent)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
            aria-label="Clear all filters"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 16 }}>
        {resultCount} products found
      </p>

      {/* Category */}
      <div className="filter-section">
        <p className="filter-section-title">Category</p>
        {[{ id: '', name: 'All Categories', icon: '🛍️' }, ...categories].map(cat => (
          <label key={cat.id} className="filter-option">
            <input
              type="checkbox"
              checked={filters.category === cat.id}
              onChange={() => onFilterChange('category', filters.category === cat.id ? '' : cat.id)}
              aria-label={`Filter by ${cat.name}`}
            />
            <span>{cat.icon}</span> {cat.name}
          </label>
        ))}
      </div>

      {/* Brand */}
      <div className="filter-section">
        <p className="filter-section-title">Brand</p>
        {brands.slice(0, 8).map(brand => (
          <label key={brand} className="filter-option">
            <input
              type="checkbox"
              checked={(filters.brands || []).includes(brand)}
              onChange={() => {
                const current = filters.brands || [];
                const updated = current.includes(brand)
                  ? current.filter(b => b !== brand)
                  : [...current, brand];
                onFilterChange('brands', updated);
              }}
              aria-label={`Filter by ${brand}`}
            />
            {brand}
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <p className="filter-section-title">Price Range</p>
        {priceRanges.map(range => (
          <label key={range.label} className="filter-option">
            <input
              type="radio"
              name="price-range"
              checked={filters.priceMin === range.min && filters.priceMax === range.max}
              onChange={() => {
                onFilterChange('priceMin', range.min);
                onFilterChange('priceMax', range.max);
              }}
              aria-label={range.label}
            />
            {range.label}
          </label>
        ))}
      </div>

      {/* Rating */}
      <div className="filter-section">
        <p className="filter-section-title">Rating</p>
        {ratingOptions.map(r => (
          <label key={r} className="filter-option">
            <input
              type="checkbox"
              checked={(filters.minRating || 0) === r}
              onChange={() => onFilterChange('minRating', filters.minRating === r ? 0 : r)}
              aria-label={`${r} stars and above`}
            />
            <Rating value={r} size={12} /> & above
          </label>
        ))}
      </div>

      {/* Color */}
      <div className="filter-section">
        <p className="filter-section-title">Color</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {colorSwatches.map(color => (
            <button
              key={color.name}
              className={`filter-color-swatch${(filters.colors || []).includes(color.name) ? ' selected' : ''}`}
              style={{ background: color.hex }}
              onClick={() => {
                const current = filters.colors || [];
                const updated = current.includes(color.name)
                  ? current.filter(c => c !== color.name)
                  : [...current, color.name];
                onFilterChange('colors', updated);
              }}
              title={color.name}
              aria-label={`Filter by ${color.name} color`}
              aria-pressed={(filters.colors || []).includes(color.name)}
            />
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="filter-section">
        <p className="filter-section-title">Availability</p>
        <label className="filter-option">
          <input
            type="checkbox"
            checked={filters.inStock || false}
            onChange={() => onFilterChange('inStock', !filters.inStock)}
            aria-label="In Stock only"
          />
          In Stock Only
        </label>
        <label className="filter-option">
          <input
            type="checkbox"
            checked={filters.onSale || false}
            onChange={() => onFilterChange('onSale', !filters.onSale)}
            aria-label="On Sale"
          />
          On Sale
        </label>
      </div>
    </aside>
  );
};

export default FilterSidebar;
