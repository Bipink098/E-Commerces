import { createContext, useContext, useReducer, useEffect } from 'react';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      if (state.items.some(item => item.id === action.payload.id)) return state;
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case 'CLEAR_WISHLIST':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: JSON.parse(localStorage.getItem('shopora_wishlist') || '[]'),
  });

  useEffect(() => {
    localStorage.setItem('shopora_wishlist', JSON.stringify(state.items));
  }, [state.items]);

  const addToWishlist = (product) => dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  const removeFromWishlist = (id) => dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) removeFromWishlist(product.id);
    else addToWishlist(product);
  };
  const isInWishlist = (id) => state.items.some(item => item.id === id);
  const clearWishlist = () => dispatch({ type: 'CLEAR_WISHLIST' });

  return (
    <WishlistContext.Provider value={{
      items: state.items,
      wishlistCount: state.items.length,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
