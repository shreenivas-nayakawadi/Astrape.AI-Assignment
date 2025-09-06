import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Cart = ({ removeFromCart }) => {
  const { cart } = useContext(AuthContext);

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Cart</h2>
      {cart.length === 0 ? (
        <div>Your cart is empty</div>
      ) : (
        cart.map((item) => (
          <div key={item._id} className="border flex justify-between items-center px-2 py-1 mb-2">
            <span>{item.name} ({item.quantity})</span>
            <button
              className="text-red-500"
              onClick={() => removeFromCart(item._id)}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};
export default Cart;
