import React, { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function CartPage() {
      const { cart, updateQty, removeFromCart, clearCart } =
            useContext(AuthContext);

      const totals = useMemo(() => {
            const subtotal = cart.reduce(
                  (sum, i) => sum + (i.price || 0) * (i.qty || 1),
                  0
            );
            const shipping = cart.length ? 99 : 0;
            const total = subtotal + shipping;
            return { subtotal, shipping, total };
      }, [cart]);

      const checkout = () => {
            if (!cart.length) return toast.error("Your cart is empty");
            toast.success("Checkout successful (demo)");
            clearCart();
      };

      return (
            <main className="container py-8">
                  <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

                  {!cart.length ? (
                        <div className="card p-8 text-center">
                              <p className="text-gray-600">
                                    Your cart is empty.
                              </p>
                        </div>
                  ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              <div className="lg:col-span-2 card p-4">
                                    <ul className="divide-y">
                                          {cart.map((item) => (
                                                <li
                                                      key={item.id}
                                                      className="flex flex-col sm:flex-row items-center gap-4 py-4"
                                                >
                                                      <img
                                                            src={
                                                                  item.image ||
                                                                  `https://picsum.photos/seed/${item.id}/100/100`
                                                            }
                                                            alt={item.name}
                                                            className="h-20 w-20 rounded-xl object-cover"
                                                      />
                                                      <div className="flex-1 w-full">
                                                            <p className="font-semibold">
                                                                  {item.name}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                  ₹
                                                                  {Number(
                                                                        item.price
                                                                  ).toLocaleString(
                                                                        "en-IN"
                                                                  )}
                                                            </p>
                                                      </div>
                                                      <div className="flex items-center gap-2">
                                                            <button
                                                                  className="btn btn-ghost"
                                                                  onClick={() =>
                                                                        updateQty(
                                                                              item.id,
                                                                              Math.max(
                                                                                    1,
                                                                                    (item.qty ||
                                                                                          1) -
                                                                                          1
                                                                              )
                                                                        )
                                                                  }
                                                            >
                                                                  -
                                                            </button>
                                                            <input
                                                                  className="input w-16 text-center"
                                                                  value={
                                                                        item.qty ||
                                                                        1
                                                                  }
                                                                  onChange={(
                                                                        e
                                                                  ) => {
                                                                        const v =
                                                                              parseInt(
                                                                                    e
                                                                                          .target
                                                                                          .value ||
                                                                                          "1",
                                                                                    10
                                                                              );
                                                                        updateQty(
                                                                              item.id,
                                                                              isNaN(
                                                                                    v
                                                                              )
                                                                                    ? 1
                                                                                    : Math.max(
                                                                                            1,
                                                                                            v
                                                                                      )
                                                                        );
                                                                  }}
                                                            />
                                                            <button
                                                                  className="btn btn-ghost"
                                                                  onClick={() =>
                                                                        updateQty(
                                                                              item.id,
                                                                              (item.qty ||
                                                                                    1) +
                                                                                    1
                                                                        )
                                                                  }
                                                            >
                                                                  +
                                                            </button>
                                                      </div>
                                                      <button
                                                            className="btn btn-danger"
                                                            onClick={() =>
                                                                  removeFromCart(
                                                                        item.id
                                                                  )
                                                            }
                                                      >
                                                            Remove
                                                      </button>
                                                </li>
                                          ))}
                                    </ul>
                              </div>

                              <div className="card p-6 h-fit">
                                    <h2 className="font-semibold mb-4">
                                          Order Summary
                                    </h2>
                                    <div className="space-y-2 text-sm">
                                          <div className="flex justify-between">
                                                <span>Subtotal</span>
                                                <span>
                                                      ₹
                                                      {totals.subtotal.toLocaleString(
                                                            "en-IN"
                                                      )}
                                                </span>
                                          </div>
                                          <div className="flex justify-between">
                                                <span>Shipping</span>
                                                <span>
                                                      ₹
                                                      {totals.shipping.toLocaleString(
                                                            "en-IN"
                                                      )}
                                                </span>
                                          </div>
                                          <div className="border-t pt-2 flex justify-between font-semibold">
                                                <span>Total</span>
                                                <span>
                                                      ₹
                                                      {totals.total.toLocaleString(
                                                            "en-IN"
                                                      )}
                                                </span>
                                          </div>
                                    </div>
                                    <button
                                          className="btn btn-primary w-full mt-4"
                                          onClick={checkout}
                                    >
                                          Checkout
                                    </button>
                              </div>
                        </div>
                  )}
            </main>
      );
}
