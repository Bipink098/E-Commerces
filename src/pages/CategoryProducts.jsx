import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/product/ProductCard';
import Breadcrumb from '../components/ui/Breadcrumb';
import { getProductsByCategory, categories } from '../data/products';

const CategoryProducts = () => {
  const { category } = useParams();
  const catObj = categories.find(c => c.id === category);
  const catName = catObj ? catObj.name : category ? category.replace('-', ' ') : 'Category';
  const categoryProducts = getProductsByCategory(category || '');

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <Breadcrumb items={[{ label: 'Shop', to: '/shop' }, { label: catName }]} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '2.5rem' }}>{catObj?.icon}</span>
            <div>
              <h1 className="page-header-title" style={{ textTransform: 'capitalize' }}>{catName}</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: 2 }}>
                {catObj?.description || `Explore our ${catName} collection`} · {categoryProducts.length} items
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px 80px' }}>
        {categoryProducts.length > 0 ? (
          <div className="products-grid products-grid-4">
            {categoryProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h2 className="empty-state-title">No products in this category</h2>
            <p className="empty-state-subtitle">Check back soon for new arrivals in {catName}.</p>
            <Link to="/shop" className="btn btn-primary">Browse All Products</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
