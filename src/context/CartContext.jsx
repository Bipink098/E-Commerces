import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingIndex = state.items.findIndex(
        item => item.id === action.payload.id &&
          item.selectedColor === action.payload.selectedColor &&
          item.selectedSize === action.payload.selectedSize
      );
      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex].quantity += action.payload.quantity || 1;
        return { ...state, items: updated };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, items: state.items.filter(item => item.cartId !== action.payload) };
    case 'UPDATE_QUANTITY': {
      const updated = state.items.map(item =>
        item.cartId === action.payload.cartId
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
      return { ...state, items: updated };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'APPLY_COUPON':
      return { ...state, coupon: action.payload };
    case 'REMOVE_COUPON':
      return { ...state, coupon: null };
    default:
      return state;
  }
};

const coupons = {
  SHOP10: 10,
  SAVE20: 20,
  FIRST15: 15,
  SUMMER50: 50,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: JSON.parse(localStorage.getItem('shopora_cart') || '[]'),
    coupon: JSON.parse(localStorage.getItem('shopora_coupon') || 'null'),
  });

  useEffect(() => {
    localStorage.setItem('shopora_cart', JSON.stringify(state.items));
    localStorage.setItem('shopora_coupon', JSON.stringify(state.coupon));
  }, [state.items, state.coupon]);

  const addToCart = (product, selectedColor, selectedSize, quantity = 1) => {
    const cartId = `${product.id}-${selectedColor}-${selectedSize}`;
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, cartId, selectedColor, selectedSize, quantity },
    });
  };

  const removeFromCart = (cartId) => dispatch({ type: 'REMOVE_FROM_CART', payload: cartId });

  const updateQuantity = (cartId, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartId, quantity } });

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const applyCoupon = (code) => {
    const discount = coupons[code.toUpperCase()];
    if (discount) {
      dispatch({ type: 'APPLY_COUPON', payload: { code: code.toUpperCase(), discount } });
      return { success: true, discount };
    }
    return { success: false };
  };

  const removeCoupon = () => dispatch({ type: 'REMOVE_COUPON' });

  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const couponDiscount = state.coupon ? (subtotal * state.coupon.discount) / 100 : 0;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = (subtotal - couponDiscount) * 0.08;
  const total = subtotal - couponDiscount + shipping + tax;

  return (
    <CartContext.Provider value={{
      items: state.items,
      coupon: state.coupon,
      cartCount,
      subtotal,
      couponDiscount,
      shipping,
      tax,
      total,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
