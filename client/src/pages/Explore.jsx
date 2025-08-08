import React, { useState, useMemo } from "react"; // Explicitly import React
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import hoodieImage from "@/assets/hoodie-1.jpg";
import tshirtImage from "@/assets/tshirt-1.jpg";

const Explore = () => {
  const [searchParams] = useSearchParams();
  // Removed type annotations for useState
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Mock products data
  const allProducts = [
    {
      id: "1",
      name: "Urban Essential Hoodie",
      price: 89,
      originalPrice: 120,
      image: hoodieImage,
      category: "hoodies",
      sizes: ["S", "M", "L", "XL"],
      isNew: true,
      onSale: true,
    },
    {
      id: "2",
      name: "Street Culture Tee",
      price: 45,
      image: tshirtImage,
      category: "tshirts",
      sizes: ["S", "M", "L"],
      isNew: true,
    },
    {
      id: "3",
      name: "Midnight Black Hoodie",
      price: 95,
      image: hoodieImage,
      category: "hoodies",
      sizes: ["M", "L", "XL", "XXL"],
    },
    {
      id: "4",
      name: "Graphic Statement Tee",
      price: 39,
      originalPrice: 55,
      image: tshirtImage,
      category: "tshirts",
      sizes: ["S", "M", "L", "XL"],
      onSale: true,
    },
    {
      id: "5",
      name: "Premium Zip Hoodie",
      price: 110,
      image: hoodieImage,
      category: "hoodies",
      sizes: ["S", "M", "L", "XL"],
      isNew: true,
    },
    {
      id: "6",
      name: "Minimalist Logo Tee",
      price: 35,
      image: tshirtImage,
      category: "tshirts",
      sizes: ["S", "M", "L"],
    },
  ];

  const categories = [
    { id: "hoodies", label: "Hoodies", count: 3 },
    { id: "tshirts", label: "T-Shirts", count: 3 },
    { id: "new", label: "New Arrivals", count: 3 },
    { id: "sale", label: "Sale", count: 2 },
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // Get initial category from URL params
  const urlCategory = searchParams.get("category");
  useMemo(() => {
    if (urlCategory && !selectedCategories.includes(urlCategory)) {
      setSelectedCategories([urlCategory]);
    }
  }, [urlCategory, selectedCategories]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => {
        return selectedCategories.some((cat) => {
          if (cat === "new") return product.isNew;
          if (cat === "sale") return product.onSale;
          return product.category === cat;
        });
      });
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by sizes
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.sizes?.some((size) => selectedSizes.includes(size))
      );
    }

    // Sort products
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [allProducts, selectedCategories, priceRange, selectedSizes, sortBy]);

  // Removed type annotations for 'categoryId' and 'checked'
  const handleCategoryChange = (categoryId, checked) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    }
  };

  // Removed type annotations for 'size' and 'checked'
  const handleSizeChange = (size, checked) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, size]);
    } else {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Explore Collection
          </h1>
          <p className="text-foreground/70">
            Discover premium streetwear that defines your style
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-4 w-4" />
                  <h3 className="font-semibold">Filters</h3>
                </div>

                {/* Categories */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-medium text-sm">Categories</h4>
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.id)}
                        // Removed type assertion 'as boolean'
                        onCheckedChange={(checked) =>
                          handleCategoryChange(category.id, checked)
                        }
                      />
                      <label
                        htmlFor={category.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                      >
                        {category.label}
                      </label>
                      <span className="text-xs text-muted-foreground">
                        ({category.count})
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Range */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-medium text-sm">Price Range</h4>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={200}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Sizes</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={size}
                          checked={selectedSizes.includes(size)}
                          // Removed type assertion 'as boolean'
                          onCheckedChange={(checked) =>
                            handleSizeChange(size, checked)
                          }
                        />
                        <label
                          htmlFor={size}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <p className="text-foreground/70">
                {filteredProducts.length} products found
              </p>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border border-border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product} // Pass the entire product object as a prop
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-foreground/60 mb-4">
                  No products found matching your filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedSizes([]);
                    setPriceRange([0, 200]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        {/* <img src={hoodieImage} alt="" />
        <img src={tshirtImage} alt="" /> */}
      </div>

      <Footer />
    </div>
  );
};

export default Explore;
