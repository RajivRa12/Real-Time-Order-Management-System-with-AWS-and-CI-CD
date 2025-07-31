import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  ArrowLeft,
  DollarSign,
  User,
  Calendar,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderFormData {
  customerName: string;
  orderAmount: string;
  description: string;
  invoiceFile: File | null;
}

export default function CreateOrder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: "",
    orderAmount: "",
    description: "",
    invoiceFile: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    if (!formData.orderAmount.trim()) {
      newErrors.orderAmount = "Order amount is required";
    } else if (isNaN(Number(formData.orderAmount)) || Number(formData.orderAmount) <= 0) {
      newErrors.orderAmount = "Please enter a valid amount";
    }

    if (!formData.invoiceFile) {
      newErrors.invoiceFile = "Invoice file is required";
    } else if (formData.invoiceFile.type !== "application/pdf") {
      newErrors.invoiceFile = "Only PDF files are allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, invoiceFile: file }));
    if (errors.invoiceFile) {
      setErrors(prev => ({ ...prev, invoiceFile: "" }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would:
      // 1. Upload the file to S3
      // 2. Create the order via POST /api/orders
      // 3. Send SNS notification
      
      toast({
        title: "Order Created Successfully!",
        description: `Order for ${formData.customerName} has been created and notifications sent.`,
      });

      // Navigate back to dashboard
      navigate("/");
    } catch (error) {
      toast({
        title: "Error Creating Order",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const number = parseFloat(value);
    if (isNaN(number)) return "";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(number);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Order</h1>
            <p className="text-muted-foreground">
              Fill in the details below to create a new order
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Order Information
            </CardTitle>
            <CardDescription>
              Please provide the customer details and upload the invoice PDF
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Name */}
              <div className="space-y-2">
                <Label htmlFor="customerName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Name
                </Label>
                <Input
                  id="customerName"
                  type="text"
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  className={cn(errors.customerName && "border-red-500")}
                />
                {errors.customerName && (
                  <p className="text-sm text-red-500">{errors.customerName}</p>
                )}
              </div>

              {/* Order Amount */}
              <div className="space-y-2">
                <Label htmlFor="orderAmount" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Order Amount
                </Label>
                <div className="relative">
                  <Input
                    id="orderAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.orderAmount}
                    onChange={(e) => handleInputChange("orderAmount", e.target.value)}
                    className={cn(errors.orderAmount && "border-red-500", "pl-8")}
                  />
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                {formData.orderAmount && !errors.orderAmount && (
                  <p className="text-sm text-muted-foreground">
                    Amount: {formatCurrency(formData.orderAmount)}
                  </p>
                )}
                {errors.orderAmount && (
                  <p className="text-sm text-red-500">{errors.orderAmount}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Order Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the order..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Invoice File (PDF)
                </Label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-colors relative",
                    dragActive && "border-primary bg-primary/5",
                    errors.invoiceFile && "border-red-500",
                    !errors.invoiceFile && "border-muted-foreground/25 hover:border-muted-foreground/50"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {formData.invoiceFile ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">{formData.invoiceFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileChange(null)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">
                        Drop your PDF file here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF files only, max 10MB
                      </p>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                {errors.invoiceFile && (
                  <p className="text-sm text-red-500">{errors.invoiceFile}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Create Order
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
