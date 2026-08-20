import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Search, Grid3X3, List, ChevronDown } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import FilterSidebar from '../components/product/FilterSidebar';
import Breadcrumb from '../components/ui/Breadcrumb';
import { products } from '../data/products';

const ITEMS_PER_PAGE = 12;

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brands: [],
    priceMin: 0,
    priceMax: Infinity,
    minRating: 0,
    colors: [],
    inStock: false,
    onSale: false,
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ category: '', brands: [], priceMin: 0, priceMax: Infinity, minRating: 0, colors: [], inStock: false, onSale: false });
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.category) result = result.filter(p => p.category === filters.category);

    // Brand
    if (filters.brands.length) result = result.filter(p => filters.brands.includes(p.brand));

    // Price
    result = result.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax);

    // Rating
    if (filters.minRating) result = result.filter(p => p.rating >= filters.minRating);

    // In Stock
    if (filters.inStock) result = result.filter(p => p.stock > 0);

    // On Sale
    if (filters.onSale) result = result.filter(p => p.discount > 0);

    // Sort
    switch (sort) {
      case 'popular': result.sort((a, b) => b.reviews - a.reviews); break;
      case 'newest': result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0)); break;
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [filters, sort, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <Breadcrumb items={[{ label: 'Shop' }]} />
          <h1 className="page-header-title">All Products</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            Discover {products.length}+ premium products
          </p>
        </div>
      </div>

      <div className="container">
        <div className="shop-layout">
          {/* Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  resultCount={filtered.length}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main */}
          <div className="shop-main">
            {/* Toolbar */}
            <div className="shop-toolbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowFilters(v => !v)}
                  aria-label={showFilters ? 'Hide filters' : 'Show filters'}
                  aria-expanded={showFilters}
                >
                  <SlidersHorizontal size={15} />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                <span className="shop-count" aria-live="polite">
                  Showing {paginated.length} of {filtered.length} products
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Search */}
                <div className="input-icon-wrapper" style={{ minWidth: 220 }}>
                  <Search size={16} className="input-icon" />
                  <input
                    type="search"
                    className="input"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                    aria-label="Search products"
                    style={{ paddingLeft: 40, height: 38, fontSize: '0.85rem' }}
                  />
                </div>

                {/* Sort */}
                <div className="shop-sort">
                  <select
                    value={sort}
                    onChange={e => { setSort(e.target.value); setPage(1); }}
                    aria-label="Sort products"
                  >
                    {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Grid */}
            {paginated.length > 0 ? (
              <motion.div
                className="products-grid products-grid-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                role="list"
                aria-label="Products list"
              >
                <AnimatePresence mode="popLayout">
                  {paginated.map(product => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      role="listitem"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="empty-state" role="status" aria-live="polite">
                <div className="empty-state-icon" aria-hidden="true">🔍</div>
                <h2 className="empty-state-title">No products found</h2>
                <p className="empty-state-subtitle">Try adjusting your filters or search query to find what you're looking for.</p>
                <button className="btn btn-primary" onClick={handleClearFilters} aria-label="Clear all filters">
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="pagination" aria-label="Products pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`pagination-btn${page === p ? ' active' : ''}`}
                    onClick={() => setPage(p)}
                    aria-label={`Page ${p}`}
                    aria-current={page === p ? 'page' : undefined}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  →
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
