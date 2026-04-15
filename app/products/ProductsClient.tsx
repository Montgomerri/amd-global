"use client";

import {
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type FormEvent,
} from "react";
import {
  ShoppingBag,
  X,
  SlidersHorizontal,
  ChevronDown,
  Heart,
  Eye,
  RefreshCw,
  Star,
  Search,
  MapPin,
  User,
  ChevronRight,
  Plus,
  Minus,
  ShoppingCart,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useCart } from "@/lib/cartContext";
import Link from "next/link";
import swell from "@/lib/swell";

type PriceFilter = "all" | "under_50" | "50_100" | "100_200" | "over_200";
type AvailabilityFilter = "all" | "in_stock" | "out_of_stock";
type PaginationItem = number | "...";

type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  createdAt: string;
};

export default function ProductsClient() {
  const { items, addItem, increaseQty, decreaseQty, totalCount } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>("all");

  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [wishlistLoaded, setWishlistLoaded] = useState(false);

  const [reviews, setReviews] = useState<Record<string, Review[]>>({});
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [reviewModalProduct, setReviewModalProduct] = useState<any>(null);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageJumpInput, setPageJumpInput] = useState("1");

  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await swell.products.list({
          limit: 100,
          expand: ["images"],
        });

        setProducts(response.results || []);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Could not load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const account = await swell.account.get();
        setUser(account || null);
      } catch {
        setUser(null);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedProduct]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("amd-wishlist");
      if (stored) {
        const parsed = JSON.parse(stored);
        setWishlist(new Set(Array.isArray(parsed) ? parsed : []));
      }
    } catch {
      setWishlist(new Set());
    } finally {
      setWishlistLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!wishlistLoaded) return;
    localStorage.setItem("amd-wishlist", JSON.stringify(Array.from(wishlist)));
  }, [wishlist, wishlistLoaded]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("amd-reviews");
      if (stored) {
        const parsed = JSON.parse(stored);
        setReviews(parsed && typeof parsed === "object" ? parsed : {});
      }
    } catch {
      setReviews({});
    } finally {
      setReviewsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!reviewsLoaded) return;
    localStorage.setItem("amd-reviews", JSON.stringify(reviews));
  }, [reviews, reviewsLoaded]);

  useEffect(() => {
    if (reviewModalProduct) {
      setReviewName(
        user?.name || user?.first_name || user?.last_name || ""
      );
      setReviewRating(5);
      setReviewText("");
    }
  }, [reviewModalProduct, user]);

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

  const getProductName = (product: any) => product?.name || "Unnamed product";

  const getProductPrice = (product: any) => Number(product?.price) || 0;

  const getProductCategory = (product: any) => {
    const category =
      product?.category?.name ||
      product?.categories?.[0]?.name ||
      product?.category ||
      product?.type ||
      "Uncategorized";

    return String(category);
  };

  const isProductInStock = (product: any) => {
    const stockStatus = String(
      product?.stock_status ||
        product?.inventory?.status ||
        product?.inventory_status ||
        ""
    ).toLowerCase();

    if (stockStatus.includes("out")) return false;
    if (stockStatus.includes("in")) return true;

    if (typeof product?.stock_level === "number") {
      return product.stock_level > 0;
    }

    if (typeof product?.inventory?.quantity === "number") {
      return product.inventory.quantity > 0;
    }

    if (typeof product?.stock === "number") {
      return product.stock > 0;
    }

    return true;
  };

  const isWishlisted = (id: string) => wishlist.has(id);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
  };

  const handleAddToCart = (e: MouseEvent<HTMLElement>, product: any) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: getProductName(product),
      price: getProductPrice(product),
      image: getImageUrl(product),
    });
  };

  const getItemQty = (id: string) => {
    return items.find((i) => i.id === id)?.quantity || 0;
  };

  const getReviewsForProduct = (productId: string): Review[] => {
    return reviews[productId] || [];
  };

  const getAverageRating = (productId: string) => {
    const list = getReviewsForProduct(productId);
    if (!list.length) return 0;
    return list.reduce((sum, review) => sum + review.rating, 0) / list.length;
  };

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(products.map((product) => getProductCategory(product)))
    ).filter(Boolean);

    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const name = getProductName(product).toLowerCase();
      const description = String(product?.description || "").toLowerCase();
      const category = getProductCategory(product);
      const price = getProductPrice(product);
      const inStock = isProductInStock(product);

      const matchesSearch =
        !query || name.includes(query) || description.includes(query);

      const matchesCategory =
        selectedCategory === "All" || category === selectedCategory;

      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "under_50" && price < 50) ||
        (priceFilter === "50_100" && price >= 50 && price <= 100) ||
        (priceFilter === "100_200" && price > 100 && price <= 200) ||
        (priceFilter === "over_200" && price > 200);

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "in_stock" && inStock) ||
        (availabilityFilter === "out_of_stock" && !inStock);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesAvailability
      );
    });
  }, [products, searchQuery, selectedCategory, priceFilter, availabilityFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceFilter, availabilityFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
      setPageJumpInput(String(totalPages));
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setPageJumpInput(String(currentPage));
  }, [currentPage]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [filteredProducts, currentPage]);

  const getPaginationItems = (): PaginationItem[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setPriceFilter("all");
    setAvailabilityFilter("all");
    setCurrentPage(1);
    setPageJumpInput("1");
    setIsMobileMenuOpen(false);
  };

  const goToPage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
  };

  const handleGoToPage = () => {
    const page = Number(pageJumpInput);
    if (Number.isNaN(page)) return;
    goToPage(page);
  };

  const handleOpenReviews = (product: any) => {
    setReviewModalProduct(product);
  };

  const handleSubmitReview = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reviewModalProduct) return;

    const name = reviewName.trim() || "Anonymous";
    const text = reviewText.trim();

    if (!text) return;

    const newReview: Review = {
      id:
        globalThis.crypto?.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      rating: Math.min(5, Math.max(1, reviewRating)),
      text,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => {
      const existing = prev[reviewModalProduct.id] || [];
      return {
        ...prev,
        [reviewModalProduct.id]: [newReview, ...existing],
      };
    });

    setReviewText("");
    setReviewRating(5);
  };

  return (
    <main className="min-h-screen bg-white font-sans text-[#222]">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-30 lg:relative">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between gap-4 lg:gap-8">
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1"
              type="button"
            >
              <Menu className="h-6 w-6 text-gray-800" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 lg:w-9 lg:h-9 bg-[#9AE600] rounded-lg flex items-center justify-center text-white font-bold italic text-lg lg:text-xl">
                
              </div>
              <span className="text-xl lg:text-2xl font-bold tracking-tight hidden sm:block">
                AMN GLOBAL
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl hidden lg:flex relative group">
            <button
              type="button"
              className="absolute left-0 top-0 h-full px-4 text-[13px] font-semibold text-gray-600 border-r flex items-center gap-1 hover:bg-gray-100 transition rounded-l-md bg-white"
            >
              Category <ChevronDown className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for..."
              className="w-full bg-[#F3F4F6] py-3.5 pl-32 pr-12 rounded-md outline-none text-sm focus:ring-1 focus:ring-[#9AE600] transition-all"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex items-center gap-4 lg:gap-6 text-[12px] text-gray-600 font-semibold whitespace-nowrap">
            <div className="hidden xl:flex items-center gap-2 cursor-pointer hover:text-[#9AE600]">
              <MapPin className="h-4 w-4 text-[#9AE600]" /> Dhaka, Bangladesh
            </div>
            <div className="hidden xl:flex items-center gap-2 underline cursor-pointer hover:text-[#9AE600]">
              English - USD
            </div>
            <Link
              href={user ? "/profile" : "/auth?next=/profile"}
              className="hidden sm:flex items-center gap-2 hover:text-[#9AE600]"
            >
              <User className="h-4 w-4" /> {user ? "Account" : "Sign up"}
            </Link>
            <Link href="/cart" className="relative flex items-center gap-2 group">
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-[#9AE600]" />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#9AE600] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm">
                    {totalCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold group-hover:text-[#9AE600] hidden sm:block">
                Cart
              </span>
            </Link>
          </div>
        </div>
      </header>

      <nav className="border-b border-gray-100 py-3.5 hidden lg:block">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center gap-9 text-[14px] font-bold text-gray-700">
          <Link href="/" className="text-[#9AE600]">
            Home
          </Link>
          <Link href="#" className="flex items-center gap-1 hover:text-[#9AE600]">
            Collections <ChevronDown className="h-4 w-4 opacity-50" />
          </Link>
          <Link href="#" className="flex items-center gap-1 hover:text-[#9AE600]">
            Pages <ChevronDown className="h-4 w-4 opacity-50" />
          </Link>
          <Link href="#" className="hover:text-[#9AE600]">
            Hot Offers
          </Link>
          <Link href="#" className="flex items-center gap-1 hover:text-[#9AE600]">
            Blog <ChevronDown className="h-4 w-4 opacity-50" />
          </Link>
          <Link href="#" className="hover:text-[#9AE600]">
            Contact
          </Link>
          <button
            type="button"
            onClick={resetFilters}
            className="ml-auto flex items-center gap-2 text-gray-500 font-medium italic hover:text-[#9AE600]"
          >
            <RefreshCw className="h-4 w-4 rotate-45" /> Reset filters
          </button>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 py-6 lg:py-12 flex flex-col lg:flex-row gap-10">
        <aside
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } lg:block w-full lg:w-64 shrink-0`}
        >
          <div className="flex items-center justify-between lg:block mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Filters
            </h1>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 bg-gray-100 rounded-full"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-100 bg-gray-50/40 space-y-3">
              <h2 className="font-bold text-[13px] uppercase tracking-widest text-gray-900">
                Search
              </h2>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#9AE600]"
              />
            </div>

            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-[13px] uppercase tracking-widest text-gray-900">
                  Category
                </h2>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className="text-[12px] text-gray-400 hover:text-[#9AE600]"
                >
                  Clear
                </button>
              </div>

              <ul className="text-[14px] max-h-64 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-0 py-3.5 hover:text-[#9AE600] transition-colors ${
                        selectedCategory === cat
                          ? "text-[#9AE600] font-bold"
                          : "text-gray-500 font-medium"
                      }`}
                    >
                      <span>{cat}</span>
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-[13px] uppercase tracking-widest text-gray-900">
                  Price
                </h2>
                <button
                  type="button"
                  onClick={() => setPriceFilter("all")}
                  className="text-[12px] text-gray-400 hover:text-[#9AE600]"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { value: "all", label: "All prices" },
                  { value: "under_50", label: "Under ₵50" },
                  { value: "50_100", label: "₵50 - ₵100" },
                  { value: "100_200", label: "₵100 - ₵200" },
                  { value: "over_200", label: "Over ₵200" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setPriceFilter(item.value as PriceFilter)}
                    className={`block w-full text-left rounded-xl px-3 py-2 text-sm transition-colors ${
                      priceFilter === item.value
                        ? "bg-[#9AE600]/10 text-[#9AE600] font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-[13px] uppercase tracking-widest text-gray-900">
                  Availability
                </h2>
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter("all")}
                  className="text-[12px] text-gray-400 hover:text-[#9AE600]"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { value: "all", label: "All items" },
                  { value: "in_stock", label: "In stock" },
                  { value: "out_of_stock", label: "Out of stock" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setAvailabilityFilter(item.value as AvailabilityFilter)
                    }
                    className={`block w-full text-left rounded-xl px-3 py-2 text-sm transition-colors ${
                      availabilityFilter === item.value
                        ? "bg-[#9AE600]/10 text-[#9AE600] font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-5 hidden lg:block">
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center justify-between font-bold text-[15px] px-2 text-gray-800 cursor-pointer hover:text-[#9AE600] transition-colors group w-full"
            >
              Reset all filters
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#9AE600] transition-colors" />
            </button>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="button"
                className="text-gray-400 font-bold text-[13px] flex items-center gap-1 hover:text-black"
              >
                See More <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        <section className="flex-1 w-full">
          <div className="lg:hidden mb-6 flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-[#F3F4F6] py-3 pl-10 pr-4 rounded-md outline-none text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="bg-[#9AE600] text-white p-3 rounded-md"
              type="button"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>

          <div className="flex justify-between items-center mb-6 lg:mb-10">
            <span className="text-gray-400 text-sm italic">
              Sort by:{" "}
              <span className="text-black font-bold cursor-pointer hover:text-[#9AE600]">
                Default
              </span>
            </span>
            <span className="text-sm font-bold text-gray-600 hidden sm:block">
              {filteredProducts.length} Products Found
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-500 font-bold">
              Loading products...
            </div>
          ) : error ? (
            <div className="py-10 text-center text-red-500 font-bold bg-red-50 rounded-xl">
              {error}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="py-16 text-center text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-6 lg:gap-y-12">
              {paginatedProducts.map((product) => {
                const qty = getItemQty(product.id);
                const isSaved = isWishlisted(product.id);
                const productName = getProductName(product);
                const productPrice = getProductPrice(product);
                const productReviews = getReviewsForProduct(product.id);
                const averageRating = getAverageRating(product.id);

                return (
                  <div key={product.id} className="group cursor-pointer">
                    <div
                      onClick={() => handleSelectProduct(product)}
                      className="relative aspect-square bg-[#F6F6F6] rounded-xl lg:rounded-[24px] flex items-center justify-center p-6 lg:p-10 overflow-hidden transition-all"
                    >
                      <div className="hidden lg:flex absolute top-5 right-5 flex-col gap-2 translate-x-14 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReviews(product);
                          }}
                          className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm hover:bg-[#9AE600] hover:text-white transition-all"
                        >
                          <Heart className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectProduct(product);
                          }}
                          className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm hover:bg-[#9AE600] hover:text-white transition-all"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            resetFilters();
                          }}
                          className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm hover:bg-[#9AE600] hover:text-white transition-all"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      </div>

                      <img
                        src={getImageUrl(product)}
                        alt={productName}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    </div>

                    <div className="mt-4 lg:mt-5 space-y-1.5 px-1">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-2.5 w-2.5 lg:h-3 lg:w-3 ${
                              s <= Math.round(averageRating)
                                ? "fill-[#FFB800] text-[#FFB800]"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                        <span className="text-[9px] lg:text-[10px] font-bold text-gray-400 ml-1">
                          ({productReviews.length} Reviews)
                        </span>
                      </div>

                      <h3
                        onClick={() => handleSelectProduct(product)}
                        className="text-[13px] lg:text-[14px] font-medium text-gray-800 line-clamp-2 leading-relaxed group-hover:text-[#9AE600] transition-colors"
                      >
                        {productName}
                      </h3>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 lg:pt-3">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[14px] lg:text-[16px]">
                            ₵{productPrice}
                          </span>
                        </div>

                        {qty > 0 ? (
                          <div className="flex items-center justify-between bg-[#9AE600] text-white rounded-lg px-2 py-1.5 gap-2 lg:gap-3 shadow-md shadow-[#9AE600]/20 transition-all sm:w-auto w-full">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                decreaseQty(product.id);
                              }}
                              className="hover:opacity-70"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5 cursor-pointer" />
                            </button>

                            <span className="text-[12px] font-black">{qty}</span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                increaseQty(product.id);
                              }}
                              className="hover:opacity-70"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5 cursor-pointer" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="text-[11px] lg:text-[12px] font-extrabold border-2 border-gray-100 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg hover:bg-[#9AE600] hover:border-[#9AE600] hover:text-white transition-all duration-300 sm:w-auto w-full text-center"
                            type="button"
                          >
                            Add to cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && filteredProducts.length > 0 && (
            <>
              <div className="mt-12 lg:mt-20 flex items-center justify-center gap-2 lg:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 lg:p-3 border border-gray-100 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-400" />
                </button>

                {getPaginationItems().map((item, index) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="text-gray-300 font-bold tracking-widest px-1 lg:px-2"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => goToPage(item)}
                      className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full font-black text-xs lg:text-sm border-2 transition-colors ${
                        currentPage === item
                          ? "bg-[#9AE600]/10 text-[#9AE600] border-[#9AE600]/10"
                          : "text-gray-500 border-transparent hover:bg-gray-50"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 lg:p-3 border border-gray-100 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <span className="text-gray-400 text-sm font-bold">
                  Go To Page
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="w-12 h-10 border border-gray-100 rounded-lg text-center font-bold outline-none focus:ring-1 focus:ring-[#9AE600]"
                    value={pageJumpInput}
                    onChange={(e) => setPageJumpInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleGoToPage}
                    className="bg-gray-50 border border-gray-100 px-5 h-10 rounded-lg text-sm font-black flex items-center gap-2 hover:bg-black hover:text-white transition-all"
                  >
                    GO <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          selectedProduct ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedProduct &&
          (() => {
            const images = getProductImages(selectedProduct);
            const drawerQty = getItemQty(selectedProduct.id);
            const drawerWishlisted = isWishlisted(selectedProduct.id);
            const drawerReviews = getReviewsForProduct(selectedProduct.id);
            const drawerAverageRating = getAverageRating(selectedProduct.id);

            return (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                    Product Details
                  </h2>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    type="button"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#F6F6F6] flex items-center justify-center p-6">
                    <img
                      src={images[activeImageIndex]}
                      alt={getProductName(selectedProduct)}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setActiveImageIndex((prev) =>
                              prev === 0 ? images.length - 1 : prev - 1
                            )
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white hover:bg-[#9AE600] hover:text-white rounded-full p-2 shadow-md transition-colors"
                          type="button"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            setActiveImageIndex((prev) =>
                              prev === images.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-[#9AE600] hover:text-white rounded-full p-2 shadow-md transition-colors"
                          type="button"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                      {images.map((url, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors shrink-0 bg-[#F6F6F6] p-1 ${
                            activeImageIndex === index
                              ? "border-[#9AE600]"
                              : "border-transparent"
                          }`}
                          type="button"
                        >
                          <img
                            src={url}
                            alt={`Thumb ${index + 1}`}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${
                            s <= Math.round(drawerAverageRating)
                              ? "fill-[#FFB800] text-[#FFB800]"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => setReviewModalProduct(selectedProduct)}
                        className="text-xs font-bold text-gray-400 ml-2 hover:text-[#9AE600]"
                      >
                        ({drawerReviews.length} Reviews)
                      </button>
                    </div>

                    <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                      {getProductName(selectedProduct)}
                    </h1>

                    <div className="flex items-end gap-3">
                      <p className="text-3xl font-black text-[#9AE600]">
                        ₵{getProductPrice(selectedProduct)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(selectedProduct.id);
                        }}
                        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                          drawerWishlisted
                            ? "border-red-200 bg-red-50 text-red-600"
                            : "border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            drawerWishlisted ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                        {drawerWishlisted ? "Saved" : "Save"}
                      </button>

                      <div className="text-sm text-gray-500">
                        {isProductInStock(selectedProduct)
                          ? "In stock"
                          : "Out of stock"}
                      </div>
                    </div>

                    {selectedProduct.description && (
                      <div className="pt-4 border-t border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-2">
                          Description
                        </h3>
                        <p
                          className="text-sm text-gray-500 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: selectedProduct.description,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-5 border-t border-gray-100 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.03)] space-y-3">
                  {drawerQty > 0 ? (
                    <div className="flex items-center justify-between bg-[#9AE600] text-white rounded-xl px-4 py-4 font-black">
                      <button
                        type="button"
                        onClick={() => decreaseQty(selectedProduct.id)}
                        className="hover:opacity-80"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-5 w-5" />
                      </button>

                      <span>{drawerQty}</span>

                      <button
                        type="button"
                        onClick={() => increaseQty(selectedProduct.id)}
                        className="hover:opacity-80"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => handleAddToCart(e, selectedProduct)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-[15px] font-black transition-all bg-[#9AE600] text-white hover:bg-[#9AE600] shadow-lg shadow-[#9AE600]/30"
                      type="button"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Add to Cart
                    </button>
                  )}

                  <Link
                    href="/cart"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-gray-100 px-6 py-4 text-[15px] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    View Full Cart
                  </Link>
                </div>
              </div>
            );
          })()}
      </div>

      {reviewModalProduct && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center px-4"
          onClick={() => setReviewModalProduct(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Reviews
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {getProductName(reviewModalProduct)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setReviewModalProduct(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center gap-2 mb-5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-5 w-5 ${
                      s <= Math.round(getAverageRating(reviewModalProduct.id))
                        ? "fill-[#FFB800] text-[#FFB800]"
                        : "text-gray-200"
                    }`}
                  />
                ))}
                <span className="text-sm font-semibold text-gray-500 ml-2">
                  {getReviewsForProduct(reviewModalProduct.id).length} reviews
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {getReviewsForProduct(reviewModalProduct.id).length > 0 ? (
                  getReviewsForProduct(reviewModalProduct.id).map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-100 rounded-2xl p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-gray-900">{review.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-4 w-4 ${
                                s <= review.rating
                                  ? "fill-[#FFB800] text-[#FFB800]"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                        {review.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
                    No reviews yet.
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <h3 className="text-base font-bold text-gray-900">
                  Add a review
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#9AE600]"
                  />

                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#9AE600]"
                  >
                    <option value={5}>5 stars</option>
                    <option value={4}>4 stars</option>
                    <option value={3}>3 stars</option>
                    <option value={2}>2 stars</option>
                    <option value={1}>1 star</option>
                  </select>
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review..."
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#9AE600] resize-none"
                />

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#9AE600] text-white py-3.5 font-bold hover:bg-[#9AE600] transition-colors"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}