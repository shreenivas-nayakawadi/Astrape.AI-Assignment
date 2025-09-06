import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const EmptyCartIcon = () => (
  <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const TruckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const QuantityButton = ({ onClick, disabled, children, variant = "default" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold transition-all duration-200 ${
      variant === "danger"
        ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
  >
    {children}
  </button>
);

export default function CartPage() {
  const { cart, updateQty, removeFromCart, clearCart } = useContext(AuthContext);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
    const shipping = cart.length ? 99 : 0;
    const tax = subtotal * 0.18; // 18% GST
    const discount = subtotal > 2000 ? 200 : 0; // ₹200 discount on orders above ₹2000
    const total = subtotal + shipping + tax - discount;
    
    return { subtotal, shipping, tax, discount, total };
  }, [cart]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    if (!cart.length) {
      toast.error("Your cart is empty");
      return;
    }
    
    toast.success("Order placed successfully! 🎉", {
      duration: 4000,
      style: {
        borderRadius: '12px',
        background: '#10b981',
        color: '#fff',
      },
    });
    clearCart();
  };

  const handleQuantityChange = (itemId, newQty) => {
    if (newQty < 1) return;
    updateQty(itemId, newQty);
  };

  const handleRemoveItem = (itemId, itemName) => {
    removeFromCart(itemId);
    toast.success(`${itemName} removed from cart`, {
      icon: "🗑️",
      style: {
        borderRadius: '12px',
        background: '#ef4444',
        color: '#fff',
      },
    });
  };

  if (!cart.length) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="card p-12">
              <EmptyCartIcon />
              <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-4">
                Your cart is empty
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                Looks like you haven't added any items to your cart yet. 
                Start shopping to fill it up!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/" className="btn btn-primary btn-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Start Shopping
                </Link>
                <button 
                  onClick={() => window.history.back()} 
                  className="btn btn-secondary btn-lg"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="xl:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Cart Items</h2>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear your cart?")) {
                      clearCart();
                      toast.success("Cart cleared");
                    }
                  }}
                  className="btn btn-ghost text-red-600 hover:bg-red-50"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-6">
                {cart.map((item, index) => (
                  <div key={item.id} className="group">
                    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=center`}
                          alt={item.name}
                          className="w-24 h-24 sm:w-20 sm:h-20 rounded-xl object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.category || 'Electronics'}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price)}
                          </span>
                          <span className="text-sm text-gray-500">
                            each
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200">
                          <QuantityButton
                            onClick={() => handleQuantityChange(item.id, (item.qty || 1) - 1)}
                            disabled={item.qty <= 1}
                          >
                            −
                          </QuantityButton>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={item.qty || 1}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              handleQuantityChange(item.id, Math.max(1, Math.min(99, value)));
                            }}
                            className="w-12 text-center text-sm font-semibold bg-transparent border-none outline-none"
                          />
                          <QuantityButton
                            onClick={() => handleQuantityChange(item.id, (item.qty || 1) + 1)}
                            disabled={item.qty >= 99}
                          >
                            +
                          </QuantityButton>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 group-hover:opacity-100 opacity-70"
                          title="Remove item"
                        >
                          <TrashIcon />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right sm:min-w-[100px]">
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice((item.price || 0) * (item.qty || 1))}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.qty || 1} × {formatPrice(item.price)}
                        </div>
                      </div>
                    </div>
                    
                    {index < cart.length - 1 && (
                      <div className="border-b border-gray-200 my-4"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <div className="card p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>{formatPrice(totals.subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (GST 18%)</span>
                    <span>{formatPrice(totals.tax)}</span>
                  </div>
                  
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(totals.discount)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(totals.total)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn btn-primary btn-lg mb-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Proceed to Checkout
                </button>

                <Link to="/" className="w-full btn btn-secondary">
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="card p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Why shop with us?</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600">
                    <ShieldIcon />
                    <span>Secure payments</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <TruckIcon />
                    <span>Free shipping on orders above ₹1000</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>30-day return policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}