import { z } from "zod";

// Order Status Enum
export const OrderStatus = z.enum(["pending", "processing", "completed", "cancelled"]);
export type OrderStatus = z.infer<typeof OrderStatus>;

// Order Entity Schema
export const OrderSchema = z.object({
  orderId: z.string(),
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email required").optional(),
  orderAmount: z.number().positive("Order amount must be positive"),
  orderDate: z.string().datetime(),
  description: z.string().optional(),
  status: OrderStatus,
  invoiceFileUrl: z.string().optional(),
  invoiceFileName: z.string().optional(),
  paymentMethod: z.string().optional(),
  shippingAddress: z.string().optional(),
  notes: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Order = z.infer<typeof OrderSchema>;

// Create Order Request Schema
export const CreateOrderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email required").optional(),
  orderAmount: z.number().positive("Order amount must be positive"),
  description: z.string().optional(),
  paymentMethod: z.string().optional(),
  shippingAddress: z.string().optional(),
});

export type CreateOrderRequest = z.infer<typeof CreateOrderSchema>;

// Update Order Request Schema
export const UpdateOrderSchema = z.object({
  customerName: z.string().min(1).optional(),
  customerEmail: z.string().email().optional(),
  orderAmount: z.number().positive().optional(),
  description: z.string().optional(),
  status: OrderStatus.optional(),
  paymentMethod: z.string().optional(),
  shippingAddress: z.string().optional(),
  notes: z.array(z.string()).optional(),
});

export type UpdateOrderRequest = z.infer<typeof UpdateOrderSchema>;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Order Query Parameters
export const OrderQuerySchema = z.object({
  page: z.coerce.number().positive().optional().default(1),
  limit: z.coerce.number().positive().max(100).optional().default(10),
  status: OrderStatus.optional(),
  search: z.string().optional(),
  sortBy: z.enum(["orderId", "customerName", "orderAmount", "orderDate", "status"]).optional().default("orderDate"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

export type OrderQuery = z.infer<typeof OrderQuerySchema>;

// Analytics Types
export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  completionRate: number;
  statusBreakdown: Record<OrderStatus, number>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  topCustomers: Array<{
    customerName: string;
    totalOrders: number;
    totalRevenue: number;
  }>;
}

// File Upload Types
export interface FileUploadResponse {
  filename: string;
  originalName: string;
  size: number;
  url: string;
  mimeType: string;
}

// Notification Types
export const NotificationSchema = z.object({
  id: z.string(),
  type: z.enum(["order_created", "order_updated", "order_completed", "order_cancelled"]),
  title: z.string(),
  message: z.string(),
  orderId: z.string(),
  timestamp: z.string().datetime(),
  read: z.boolean().default(false),
});

export type Notification = z.infer<typeof NotificationSchema>;

// Export Operation Types
export interface ExportRequest {
  format: "csv" | "excel";
  filters?: Partial<OrderQuery>;
}

export interface ExportResponse {
  downloadUrl: string;
  filename: string;
  expiresAt: string;
}
