"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Check,
} from "lucide-react";
import { useCart } from "@/lib/cartContext";
import Link from "next/link";
import swell from "@/lib/swell";

const filters = [
  { label: "Category", options: ["Electronics", "Clothing", "Home", "Sports"] },
  { label: "Price", options: ["Under ₵50", "₵50–₵100", "₵100–₵200", "Over ₵200"] },
  { label: "Brand", options: ["Brand A", "Brand B", "Brand C"] },
  { label: "Availability", options: ["In Stock", "Out of Stock"] },
];

export default function ProductsClient() {
  const { addItem, totalCount } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await swell.products.list({
          limit: 20,
          expand: ["images"],
        });

        setProducts(response.results || []);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Could not load products right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedProduct]);

  const getImageUrl = (product: any) =>
    product?.image?.file?.url ||
    (product?.images?.length > 0 ? product.images[0].file.url : "/no-image.png");

  const getProductImages = (product: any): string[] => {
    if (!product) return ["/no-image.png"];

    if (product.images && product.images.length > 0) {
      return product.images.map((img: any) => img.file.url);
    }

    if (product.image?.file?.url) return [product.image.file.url];

    return ["/no-image.png"];
  };

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
  };

  const handlePrevImage = () => {
    if (!selectedProduct) return;
    const images = getProductImages(selectedProduct);
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!selectedProduct) return;
    const images = getProductImages(selectedProduct);
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: getImageUrl(product),
    });

    setAddedIds((prev) => new Set(prev).add(product.id));

    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gray-100 font-sans">
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">
            {loading ? "Loading..." : `${products.length} Products`}
          </span>
        </div>

        <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <ShoppingCart className="h-5 w-5 text-gray-700" />
          {totalCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-lime-400 text-zinc-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalCount}
            </span>
          )}
        </Link>
      </div>

      <div className="flex max-w-7xl mx-auto px-4 py-6 gap-6">
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">
              Filter By
            </h2>
            {filters.map((filter) => (
              <div key={filter.label} className="border-t py-3">
                <button
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-700"
                  onClick={() =>
                    setOpenFilter(openFilter === filter.label ? null : filter.label)
                  }
                >
                  {filter.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openFilter === filter.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFilter === filter.label && (
                  <ul className="mt-2 space-y-1">
                    {filter.options.map((opt) => (
                      <li key={opt}>
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                          <input type="checkbox" className="accent-lime-500" />
                          {opt}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </aside>

        <section className="flex-1">
          {loading && (
            <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-600">
              Loading products...
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-600">
              No products found.
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map((product) => {
                const imageUrl = getImageUrl(product);
                const isAdded = addedIds.has(product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer group overflow-hidden"
                  >
                    <div className="relative h-48 bg-gray-50 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
                        {product.name}
                      </h2>
                      <p className="mt-1 text-lg font-bold text-gray-900">
                        ₵{product.price}
                      </p>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`mt-3 w-full flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                          isAdded
                            ? "bg-green-500 text-white"
                            : "bg-lime-400 text-zinc-900 hover:bg-lime-300"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="h-4 w-4" />
                            Added!
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-4 w-4" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setSelectedProduct(null)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          selectedProduct ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedProduct && (() => {
          const images = getProductImages(selectedProduct);
          const isAdded = addedIds.has(selectedProduct.id);

          return (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-lg font-bold text-gray-800">Product Details</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={images[activeImageIndex]}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow transition"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow transition"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 mt-3">
                    {images.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`w-16 h-16 rounded-md overflow-hidden border-2 transition ${
                          activeImageIndex === index
                            ? "border-lime-400"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                <h1 className="mt-5 text-2xl font-bold text-gray-900">
                  {selectedProduct.name}
                </h1>
                <p className="mt-2 text-2xl font-bold text-lime-600">
                  ₵{selectedProduct.price}
                </p>
                {selectedProduct.description && (
                  <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                )}
              </div>

              <div className="px-6 py-4 border-t bg-gray-50 flex flex-col gap-2">
                <button
                  onClick={(e) => handleAddToCart(e, selectedProduct)}
                  className={`w-full flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition ${
                    isAdded
                      ? "bg-green-500 text-white"
                      : "bg-lime-400 text-zinc-900 hover:bg-lime-300"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="h-5 w-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </button>

                <Link
                  href="/cart"
                  className="w-full flex items-center justify-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  View Cart
                </Link>
              </div>
            </div>
          );
        })()}
      </div>
    </main>
  );
}