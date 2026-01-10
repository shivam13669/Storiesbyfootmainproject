import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export type FilterState = {
  search: string;
  category: string;
  priceRange: string;
  rating: string;
};

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const CATEGORIES = ["All", "Beach", "Mountain", "City", "Luxury", "Adventure"];
const PRICE_RANGES = [
  { label: "All", value: "all" },
  { label: "₹0 - ₹25,000", value: "0-25000" },
  { label: "₹25,000 - ₹40,000", value: "25000-40000" },
  { label: "₹40,000+", value: "40000+" },
];
const RATINGS = [
  { label: "All", value: "all" },
  { label: "4.5+", value: "4.5" },
  { label: "4.7+", value: "4.7" },
  { label: "4.8+", value: "4.8" },
];

export const FilterSidebar = ({ filters, onFiltersChange }: FilterSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category,
    });
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      priceRange: e.target.value,
    });
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      rating: e.target.value,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      search: "",
      category: "All",
      priceRange: "all",
      rating: "all",
    });
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "fixed inset-0 z-50 bg-black/50 md:relative md:inset-auto md:z-auto md:bg-transparent" : "hidden md:block"
        }`}
        onClick={() => isMobile && setIsOpen(false)}
      >
        <div
          className="sticky top-24 h-fit w-full md:w-56 bg-card border-r border-border p-4 overflow-y-auto md:overflow-visible"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <h2 className="text-base font-semibold">Filters</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          {/* Search */}
          <div className="mb-5">
            <h3 className="font-semibold text-sm mb-2">Search</h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Category */}
          <div className="mb-5">
            <h3 className="font-semibold text-sm mb-2">Category</h3>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={filters.category === category}
                    onChange={() => handleCategoryChange(category)}
                    className="w-4 h-4 cursor-pointer accent-primary"
                  />
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-5">
            <h3 className="font-semibold text-sm mb-2">Price Range</h3>
            <select
              value={filters.priceRange}
              onChange={handlePriceRangeChange}
              className="w-full px-2.5 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {PRICE_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div className="mb-5">
            <h3 className="font-semibold text-sm mb-2">Rating</h3>
            <select
              value={filters.rating}
              onChange={handleRatingChange}
              className="w-full px-2.5 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {RATINGS.map((rating) => (
                <option key={rating.value} value={rating.value}>
                  {rating.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="w-full text-xs py-1.5"
          >
            Reset Filters
          </Button>
        </div>
      </aside>
    </>
  );
};
