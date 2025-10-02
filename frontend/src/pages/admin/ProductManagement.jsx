import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit,
  Trash2,
  Loader2,
  PlusCircle,
  ImageIcon,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import the centralized API functions
import { adminGetAllProducts, adminDeleteProduct } from "../../api/apiService";

// Import the modal components (we will create/update these next)
import ProductDetailsModal from "../../components/admin/ProductDetailsModal";
import EditProductModal from "../../components/admin/EditProductModal";
import AddProductModal from "../../components/admin/AddProductModal"; // New modal for creating products

// Helper function to calculate total stock for a product
const calculateTotalStock = (product) => {
  if (!product.variants || product.variants.length === 0) return 0;
  return product.variants.reduce((totalStock, variant) => {
    const variantStock = variant.colors.reduce((variantTotal, color) => {
      const colorStock = color.stock.reduce(
        (colorTotal, size) => colorTotal + size.quantity,
        0
      );
      return variantTotal + colorStock;
    }, 0);
    return totalStock + variantStock;
  }, 0);
};

// Helper function to display a price range
const getPriceRange = (product) => {
  if (!product.variants || product.variants.length === 0) return "N/A";
  const prices = product.variants.flatMap((variant) =>
    variant.colors.map((color) => color.price)
  );
  if (prices.length === 0) return "N/A";
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  if (minPrice === maxPrice) return `₹${minPrice.toFixed(2)}`;
  return `₹${minPrice.toFixed(2)} - ₹${maxPrice.toFixed(2)}`;
};
// Helper function to format the new category object for display
const formatCategory = (category) => {
  if (!category || !category.type) return "Uncategorized";
  const parts = [category.type];
  // CORRECTED: 'collection' to 'subCollection'
  if (category.subCollection) parts.push(category.subCollection);
  if (category.college) parts.push(category.college);
  if (category.department) parts.push(category.department);
  return parts.join(" / ");
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // State for modals
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State for filtering and sorting
  const [filters, setFilters] = useState({
    categoryType: "all",
    isActive: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Use the centralized API function and pass filters
      const response = await adminGetAllProducts(filters);
      setProducts(response.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to fetch products.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]); // Dependency on filters object

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    // In a real app, you might use a custom confirmation modal instead of window.confirm
    if (
      !window.confirm(
        "Are you sure? This archives or deletes the product based on its order history."
      )
    ) {
      return;
    }
    try {
      const response = await adminDeleteProduct(productId);
      console.log(response);
      toast({
        title: "Success",
        description: response.data.message,
        variant: "success",
      });
      fetchProducts(); // Refresh the list
    } catch (err) {
      console.error("Error deleting product:", err);
      toast({
        title: "Failed to Delete",
        description: err.response?.data?.message || "Server error.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="bg-card/50 border-border/50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold gradient-text">
              Product Management
            </CardTitle>
            <CardDescription>
              View, add, edit, and manage all products.
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </CardHeader>

        {/* Filter and Sort Controls */}
        <div className="p-4 sm:p-6 border-t border-b border-border/50 bg-background/20">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium mb-1 block">
                Category Type
              </label>
              <Select
                value={filters.categoryType}
                onValueChange={(value) =>
                  handleFilterChange("categoryType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="College Store">College Store</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select
                value={filters.isActive}
                onValueChange={(value) => handleFilterChange("isActive", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium mb-1 block">Sort By</label>
              <div className="flex gap-2">
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange("sortBy", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date Created</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="sortPriority">Sort Priority</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={toggleSortOrder}>
                  {filters.sortOrder === "asc" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-4 sm:p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-10">{error}</div>
          ) : products.length === 0 ? (
            <p className="text-center py-10">
              No products found for the selected filters.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Stock</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id} className="hover:bg-muted/50">
                      <TableCell>
                        {product.variants?.[0]?.colors.find(
                          (e) => e.name === "Black"
                        )?.images?.[0] ? (
                          <img
                            src={
                              product.variants[0].colors.find(
                                (e) => e.name === "Black"
                              ).images[0]
                            }
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center rounded-md bg-secondary">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-xs max-w-xs truncate">
                        {formatCategory(product.category)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={product.isActive ? "success" : "secondary"}
                        >
                          {product.isActive ? "Active" : "Archived"}
                        </Badge>
                      </TableCell>
                      <TableCell>{calculateTotalStock(product)}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {getPriceRange(product)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(product)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conditionally render modals */}
      {isDetailsModalOpen && selectedProduct && (
        <ProductDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          product={selectedProduct}
        />
      )}
      {isEditModalOpen && productToEdit && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={productToEdit}
          onProductUpdated={fetchProducts} // Pass the refresh function
        />
      )}
      {isAddModalOpen && (
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onProductAdded={fetchProducts} // Pass the refresh function
        />
      )}
    </>
  );
};

export default ProductManagement;
