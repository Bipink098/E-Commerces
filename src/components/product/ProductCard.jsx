import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

const Rating = ({ value, size = 14 }) => {
  return (
    <span className="stars" aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(value) ? 'star-filled' : 'star-empty'}
          fill={i <= Math.round(value) ? 'currentColor' : 'none'}
        />
      ))}
    </span>
  );
};

const ProductCard = ({ product, className = '' }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, product.colors[0] || 'Default', product.sizes[0] || 'One Size');
    toast.success(`${product.name.substring(0, 30)}... added to cart!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  return (
    <motion.div
      className={`product-card ${className}`}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
        {/* Image */}
        <div className="product-card-image-wrapper">
          <img
            src={product.images[0]}
            alt={product.name}
            className="product-card-image"
            loading="lazy"
          />

          {/* Badges */}
          <div className="product-card-badges" aria-label="Product badges">
            {product.discount > 0 && (
              <span className="badge badge-accent" aria-label={`${product.discount}% discount`}>
                -{product.discount}%
              </span>
            )}
            {product.bestseller && (
              <span className="badge badge-primary">Bestseller</span>
            )}
            {product.newArrival && (
              <span className="badge badge-success">New</span>
            )}
          </div>

          {/* Hover Actions */}
          <div className="product-card-actions" role="group" aria-label="Quick actions">
            <motion.button
              className={`product-card-action-btn ${inWishlist ? 'active' : ''}`}
              onClick={handleWishlist}
              whileTap={{ scale: 0.85 }}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={inWishlist}
            >
              <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
            </motion.button>
            <Link
              to={`/product/${product.id}`}
              className="product-card-action-btn"
              aria-label="Quick view"
              onClick={e => e.stopPropagation()}
            >
              <Eye size={16} />
            </Link>
          </div>
        </div>

        {/* Body */}
        <div className="product-card-body">
          <p className="product-category">{product.category.replace('-', ' ')}</p>
          <h3 className="product-name">{product.name}</h3>

          <div className="product-rating-row" aria-label={`${product.rating} stars, ${product.reviews} reviews`}>
            <Rating value={product.rating} />
            <span className="product-rating-text">{product.rating}</span>
            <span className="product-reviews">({product.reviews.toLocaleString()})</span>
          </div>

          <div className="product-price-row">
            <span className="product-price">${product.price.toFixed(2)}</span>
            {product.oldPrice > product.price && (
              <span className="product-old-price">${product.oldPrice.toFixed(2)}</span>
            )}
            {product.discount > 0 && (
              <span className="product-discount" aria-label={`Save ${product.discount}%`}>
                Save {product.discount}%
              </span>
            )}
          </div>
        </div>
      </Link>

      <div style={{ padding: '0 18px 18px' }}>
        <motion.button
          className="product-add-btn"
          onClick={handleAddToCart}
          whileTap={{ scale: 0.97 }}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart size={15} />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

export { Rating };
export default ProductCard;
