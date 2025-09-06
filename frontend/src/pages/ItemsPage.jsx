import React, { useContext, useEffect, useState } from "react";
import api from "../utils/api";
import ItemCard from "../components/ItemCard";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const SkeletonCard = () => (
  <div className="card animate-pulse">
    <div className="h-48 bg-gray-200 skeleton"></div>
    <div className="p-5 space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-20 skeleton"></div>
        <div className="h-4 bg-gray-200 rounded w-16 skeleton"></div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-3/4 skeleton"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded skeleton"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6 skeleton"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-24 skeleton"></div>
      <div className="h-10 bg-gray-200 rounded skeleton"></div>
    </div>
  </div>
);

export default function ItemsPage() {
  const { addToCart, token } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["all", "electronics", "clothing", "books", "home", "sports"];
  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
  ];

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [items, searchTerm, selectedCategory, sortBy]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/items");
      const itemsData = Array.isArray(res?.data) ? res.data : res?.data?.items || [];
      setItems(itemsData);
    } catch (err) {
      console.error("Failed to load items:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortItems = () => {
    let filtered = [...items];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item =>
        item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });

    setFilteredItems(filtered);
  };

  const handleAddToCart = async (item) => {
    if (!token) {
      toast.error("Please login to add items to cart", {
        icon: "🔒",
        style: {
          borderRadius: '12px',
          background: '#ef4444',
          color: '#fff',
        },
      });
      return;
    }

    try {
      addToCart(item);
      toast.success(`${item.name} added to cart!`, {
        icon: "🛒",
        style: {
          borderRadius: '12px',
          background: '#10b981',
          color: '#fff',
        },
      });
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing{" "}
            <span className="text-gradient">Products</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated collection of premium products designed to enhance your lifestyle
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="card p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-12 w-full"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </div>
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input w-full lg:w-auto min-w-[150px]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input w-full lg:w-auto min-w-[180px]"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid" 
                      ? "bg-white shadow-sm text-indigo-600" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <GridIcon />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list" 
                      ? "bg-white shadow-sm text-indigo-600" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <ListIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {loading ? "Loading..." : `${filteredItems.length} Products`}
              </h2>
              {searchTerm && (
                <span className="text-sm text-gray-500">
                  for "{searchTerm}"
                </span>
              )}
            </div>
            
            {!loading && filteredItems.length > 0 && (
              <div className="text-sm text-gray-500">
                Showing {filteredItems.length} of {items.length} products
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="card p-12 max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "No products are available at the moment"}
              </p>
              <div className="flex gap-3 justify-center">
                {(searchTerm || selectedCategory !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="btn btn-secondary"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={loadItems}
                  className="btn btn-primary"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={`grid gap-6 animate-fade-in ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1 max-w-4xl mx-auto"
          }`}>
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id || item._id}
                item={{
                  id: item.id || item._id,
                  name: item.name || item.title,
                  description: item.description,
                  price: item.price,
                  image: item.image,
                  category: item.category,
                }}
                onAdd={handleAddToCart}
              />
            ))}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {!loading && filteredItems.length > 0 && filteredItems.length >= 12 && (
          <div className="text-center mt-12">
            <button className="btn btn-secondary btn-lg">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </main>
  );
}