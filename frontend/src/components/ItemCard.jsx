import React from "react";

export default function ItemCard({ item, onAdd }) {
      return (
            <div className="card card-hover h-full flex flex-col">
                  <img
                        src={
                              item.image ||
                              `https://picsum.photos/seed/${item.id}/600/400`
                        }
                        alt={item.name}
                        className="h-40 w-full rounded-t-2xl object-cover"
                        loading="lazy"
                  />
                  <div className="p-4 flex flex-col gap-2 flex-1">
                        <h3 className="text-base font-semibold line-clamp-1">
                              {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                              {item.description || "No description provided."}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                              <span className="text-lg font-bold">
                                    ₹
                                    {Number(item.price || 0).toLocaleString(
                                          "en-IN"
                                    )}
                              </span>
                              <button
                                    className="btn btn-primary"
                                    onClick={() => onAdd?.(item)}
                              >
                                    Add to Cart
                              </button>
                        </div>
                  </div>
            </div>
      );
}
