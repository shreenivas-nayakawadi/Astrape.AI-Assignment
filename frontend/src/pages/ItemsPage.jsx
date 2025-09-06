import React, { useContext, useEffect, useState } from "react";
import api from "../utils/api";
import ItemCard from "../components/ItemCard";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ItemsPage() {
      const { addToCart } = useContext(AuthContext);
      const [items, setItems] = useState([]);
      const [loading, setLoad] = useState(true);

      useEffect(() => {
            const load = async () => {
                  try {
                        setLoad(true);
                        const res = await api.get("/items"); // adjust endpoint if different
                        setItems(
                              Array.isArray(res?.data)
                                    ? res.data
                                    : res?.data?.items || []
                        );
                  } catch (err) {
                        // interceptor toasts error
                  } finally {
                        setLoad(false);
                  }
            };
            load();
      }, []);

      const handleAdd = (item) => addToCart(item);

      return (
            <main className="container py-8">
                  <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">Items</h1>
                        <p className="text-sm text-gray-600">
                              {items.length} results
                        </p>
                  </div>

                  {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {Array.from({ length: 6 }).map((_, i) => (
                                    <div
                                          key={i}
                                          className="card h-[300px] animate-pulse"
                                    />
                              ))}
                        </div>
                  ) : items.length === 0 ? (
                        <div className="card p-8 text-center">
                              <p className="text-gray-600">No items found.</p>
                              <button
                                    className="btn btn-ghost mt-3"
                                    onClick={() => window.location.reload()}
                              >
                                    Refresh
                              </button>
                        </div>
                  ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {items.map((item) => (
                                    <ItemCard
                                          key={item.id || item._id}
                                          item={{
                                                id: item.id || item._id,
                                                name: item.name || item.title,
                                                description: item.description,
                                                price: item.price,
                                                image: item.image,
                                          }}
                                          onAdd={handleAdd}
                                    />
                              ))}
                        </div>
                  )}
            </main>
      );
}
