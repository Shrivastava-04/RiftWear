import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  Trash2,
  Loader2,
  PlusCircle,
  ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import ProductDetailsModal from "./ProductDetailsModal";
import EditProductModal from "./EditProductModel";

const ProductManagement = ({ setActiveTab }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { toast } = useToast();

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/admin/products`);
      setProducts(response.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [API_BASE_URL]);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/admin/products/${productId}`);
      toast({
        title: "Product Deleted",
        description: "The product was removed successfully.",
        variant: "success",
      });
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      toast({
        title: "Failed to Delete",
        description: err.response?.data?.message || "Server error.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="bg-card/50 border-border/50 p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Loading products...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card/50 border-destructive/50 p-6 text-destructive">
        <p>Error: {error}</p>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl gradient-text">
          All Products ({products.length})
        </CardTitle>
        <Button
          onClick={() => setActiveTab("addProduct")}
          size="sm"
          className="whitespace-nowrap"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {products.length === 0 ? (
          <p className="text-foreground/70 text-center py-4">
            No products found. Add some!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Colors</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium whitespace-normal">
                      {product.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      ₹{product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {product.category}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.colors && product.colors.length > 0 ? (
                          product.colors.map((color, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={color.images[0]}
                                alt={color.name}
                                className="w-8 h-8 rounded-full object-cover border-2 border-border cursor-pointer"
                              />
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                                {color.name}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            N/A
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right flex space-x-2 justify-end">
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
                        className="text-destructive"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
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
          onProductUpdated={fetchProducts}
        />
      )}
    </Card>
  );
};

export default ProductManagement;
