import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Download,
  FileText,
  User,
  DollarSign,
  Calendar,
  Package,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderDetail {
  orderId: string;
  customerName: string;
  customerEmail: string;
  orderAmount: number;
  orderDate: string;
  invoiceFileUrl: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  description: string;
  paymentMethod: string;
  shippingAddress: string;
  notes: string[];
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch order details
    setTimeout(() => {
      // Mock data - in real app this would come from API
      setOrder({
        orderId: id || "ORD-001",
        customerName: "John Smith",
        customerEmail: "john.smith@email.com",
        orderAmount: 1299.99,
        orderDate: "2024-01-15T10:30:00Z",
        invoiceFileUrl: "#",
        status: "completed",
        description: "High-performance laptop with extended warranty and accessories package",
        paymentMethod: "Credit Card (**** 4242)",
        shippingAddress: "123 Main St, Springfield, IL 62701, USA",
        notes: [
          "Order received and confirmed",
          "Payment processed successfully", 
          "Items prepared for shipping",
          "Order shipped via FedEx Express",
          "Delivered successfully"
        ]
      });
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="text-center py-12">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
            <p className="text-muted-foreground">
              View and manage order #{order.orderId}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order #{order.orderId}
                    </CardTitle>
                    <CardDescription>
                      Placed on {formatDate(order.orderDate)}
                    </CardDescription>
                  </div>
                  <Badge className={cn("flex items-center gap-1 capitalize", getStatusColor(order.status))}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {order.description}
                  </p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Order Amount
                    </h4>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(order.orderAmount)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Payment Method</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Name</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.customerName}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.customerEmail}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Shipping Address</h4>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingAddress}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Order Timeline
                </CardTitle>
                <CardDescription>
                  Track the progress of this order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.notes.map((note, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">{note}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(Date.now() - (order.notes.length - index) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View Invoice
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Track Shipment
                </Button>
              </CardContent>
            </Card>

            {/* Order Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Order Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Days since order</span>
                  <span className="font-medium">
                    {Math.floor((Date.now() - new Date(order.orderDate).getTime()) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Processing time</span>
                  <span className="font-medium">2-3 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Order priority</span>
                  <Badge variant="secondary">Standard</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
