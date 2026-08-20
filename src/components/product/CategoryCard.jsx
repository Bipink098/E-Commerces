import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category, index = 0 }) => {
  const categoryImages = {
    electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
    fashion: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&q=80',
    shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    accessories: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    beauty: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
    'home-living': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link to={`/category/${category.id}`} aria-label={`Browse ${category.name}`}>
        <div className="category-card">
          <div style={{ position: 'relative', marginBottom: 16, overflow: 'hidden', borderRadius: 'var(--radius-md)', aspectRatio: '1/1' }}>
            <motion.img
              src={categoryImages[category.id]}
              alt={`${category.name} category`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="category-icon" role="img" aria-hidden="true">{category.icon}</span>
          <p className="category-name">{category.name}</p>
          <p className="category-desc">{category.description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
