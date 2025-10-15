import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Star,
} from "lucide-react";

// --- Core Hooks & API ---
import {
  fetchOrderById,
  addProductReview,
  checkIfUserCanReview,
} from "@/api/apiService";
import { useToast } from "@/hooks/use-toast";

// --- UI Components ---
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Spinner from "@/components/common/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReviewForm from "@/components/reviews/ReviewForm";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [productToReview, setProductToReview] = useState(null);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId,
  });

  const order = response?.data?.order;
  console.log("INSPECT THIS ITEM:", order?.items[0]); // <-- ADD THIS LINE

  const reviewEligibilityQueries = useQueries({
    queries: (order?.items ?? []).map((item) => ({
      queryKey: ["canReview", item.product.productId],
      queryFn: () => checkIfUserCanReview(item.product.productId),
      enabled: !!(
        order?.orderStatus?.toLowerCase() === "delivered" &&
        item.product.productId
      ),
    })),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ productId, reviewData }) =>
      addProductReview(productId, reviewData),
    onSuccess: (_, variables) => {
      toast({ title: "Review submitted!", variant: "success" });
      queryClient.invalidateQueries({
        queryKey: ["canReview", variables.productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
      closeReviewModal();
    },
    onError: (err) => {
      toast({
        title: "Submission Failed",
        description: err.response?.data?.message,
        variant: "destructive",
      });
    },
  });

  // --- FINAL FIX IS HERE ---
  // The 'item' object is passed in. We correctly get its 'productId' and 'productName'.
  const openReviewModal = (item) => {
    setProductToReview({ id: item.product.productId, name: item.productName });
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setProductToReview(null);
  };

  const handleReviewSubmit = (reviewData) => {
    if (!productToReview || !productToReview.id) {
      console.error(
        "Could not submit review, productToReview state is missing the ID.",
        productToReview
      );
      return;
    }
    reviewMutation.mutate({ productId: productToReview.id, reviewData });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive text-2xl">
              Error Loading Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {error.response?.data?.message ||
                "Could not retrieve order details."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) return null;

  const {
    shippingInfo = {},
    pricingInfo = {},
    paymentInfo = {},
    items = [],
  } = order;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-foreground/70 hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">
              Order Details
            </h1>
            <p className="text-sm text-muted-foreground">
              Order #{order.orderNumber}
            </p>
          </div>
          <Badge
            variant={
              order.orderStatus.toLowerCase() === "delivered"
                ? "default"
                : "secondary"
            }
            className="text-sm px-3 py-1"
          >
            {order.orderStatus}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Items Ordered ({items.length})</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/50">
                {items.map((item, index) => {
                  const eligibilityResult =
                    reviewEligibilityQueries[index]?.data?.data;
                  console.log(reviewEligibilityQueries[index]);
                  const canReview = eligibilityResult?.canReview;
                  const isAlreadyReviewed =
                    eligibilityResult?.reason === "already_reviewed";

                  return (
                    <div
                      key={item._id || index}
                      className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 py-4"
                    >
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-foreground/70">{`Size: ${item.size} | ${item.variantName} | ${item.colorName} | Qty: ${item.quantity}`}</p>
                        {item.nameToPrint && (
                          <p className="text-sm text-accent">
                            Custom Name: {item.nameToPrint}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                        <p className="font-semibold mb-2">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                        {order.orderStatus.toLowerCase() === "delivered" && (
                          <>
                            {isAlreadyReviewed && (
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1 cursor-default"
                              >
                                <Star className="h-3 w-3" /> Reviewed
                              </Badge>
                            )}
                            {canReview && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openReviewModal(item)}
                              >
                                Rate & Review
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-accent" /> Shipping
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">
                  {shippingInfo.firstName} {shippingInfo.lastName}
                </p>
                <p>
                  {shippingInfo.street}
                  {shippingInfo.landmark ? `, ${shippingInfo.landmark}` : ""}
                </p>
                <p>
                  {shippingInfo.city}, {shippingInfo.state} -{" "}
                  {shippingInfo.postalCode}
                </p>
                <p>Phone: {shippingInfo.phoneNumber}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-3 text-accent" /> Payment
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items Total:</span>
                  <span>₹{(pricingInfo.itemsPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Custom Name Printing:</span>
                  <span>₹{(pricingInfo.printingFee || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{(pricingInfo.shippingPrice || 0).toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total Amount:</span>
                  <span>₹{(pricingInfo.totalAmount || 0).toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>{paymentInfo.method || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className="font-semibold capitalize">
                    {paymentInfo.status || "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review: {productToReview?.name}</DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <ReviewForm
              onSubmit={handleReviewSubmit}
              isSubmitting={reviewMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default OrderDetail;
