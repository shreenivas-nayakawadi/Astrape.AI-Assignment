import React, { createContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export const AuthContext = createContext();

const safeParse = (v, fallback) => {
      try {
            return JSON.parse(v);
      } catch {
            return fallback;
      }
};

export const AuthProvider = ({ children }) => {
      const [token, setToken] = useState(
            () => localStorage.getItem("token") || ""
      );
      const [cart, setCart] = useState(() =>
            safeParse(localStorage.getItem("cart"), [])
      );

      // persist
      useEffect(() => {
            if (token) localStorage.setItem("token", token);
            else localStorage.removeItem("token");
      }, [token]);

      useEffect(() => {
            localStorage.setItem("cart", JSON.stringify(cart));
      }, [cart]);

      // cart helpers
      const addToCart = (item) => {
            setCart((prev) => {
                  const exists = prev.find((p) => p.id === item.id);
                  if (exists) {
                        return prev.map((p) =>
                              p.id === item.id ? { ...p, qty: p.qty + 1 } : p
                        );
                  }
                  toast.success("Added to cart");
                  return [...prev, { ...item, qty: 1 }];
            });
      };

      const removeFromCart = (id) => {
            setCart((prev) => prev.filter((p) => p.id !== id));
      };

      const updateQty = (id, qty) => {
            setCart((prev) =>
                  prev.map((p) => (p.id === id ? { ...p, qty } : p))
            );
      };

      const clearCart = () => setCart([]);

      const value = useMemo(
            () => ({
                  token,
                  setToken,
                  cart,
                  setCart,
                  addToCart,
                  removeFromCart,
                  updateQty,
                  clearCart,
            }),
            [token, cart]
      );

      return (
            <AuthContext.Provider value={value}>
                  {children}
            </AuthContext.Provider>
      );
};
