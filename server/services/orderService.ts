import { v4 as uuidv4 } from 'uuid';
import {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderQuery,
  OrderAnalytics,
  OrderStatus,
  Notification
} from '../../shared/orders.js';

class OrderService {
  private orders: Order[] = [];
  private notifications: Notification[] = [];

  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleOrders: Order[] = [
      {
        orderId: "ORD-001",
        customerName: "John Smith",
        customerEmail: "john.smith@email.com",
        orderAmount: 1299.99,
        orderDate: "2024-01-15T10:30:00Z",
        description: "High-performance laptop with extended warranty",
        status: "completed",
        invoiceFileUrl: "/uploads/invoices/invoice-001.pdf",
        invoiceFileName: "invoice-001.pdf",
        paymentMethod: "Credit Card (**** 4242)",
        shippingAddress: "123 Main St, Springfield, IL 62701, USA",
        notes: [
          "Order received and confirmed",
          "Payment processed successfully", 
          "Items prepared for shipping",
          "Order shipped via FedEx Express",
          "Delivered successfully"
        ],
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-18T16:45:00Z"
      },
      {
        orderId: "ORD-002", 
        customerName: "Sarah Johnson",
        customerEmail: "sarah.j@email.com",
        orderAmount: 599.50,
        orderDate: "2024-01-14T14:20:00Z",
        description: "Professional camera kit",
        status: "processing",
        invoiceFileUrl: "/uploads/invoices/invoice-002.pdf",
        invoiceFileName: "invoice-002.pdf",
        paymentMethod: "PayPal",
        shippingAddress: "456 Oak Ave, Boston, MA 02101, USA",
        notes: [
          "Order received and confirmed",
          "Payment processed successfully",
          "Items being prepared for shipping"
        ],
        createdAt: "2024-01-14T14:20:00Z",
        updatedAt: "2024-01-15T09:15:00Z"
      },
      {
        orderId: "ORD-003",
        customerName: "Mike Davis",
        customerEmail: "mike.davis@email.com",
        orderAmount: 2150.00,
        orderDate: "2024-01-13T09:15:00Z",
        description: "Premium gaming setup with accessories",
        status: "pending",
        invoiceFileUrl: "/uploads/invoices/invoice-003.pdf",
        invoiceFileName: "invoice-003.pdf",
        paymentMethod: "Bank Transfer",
        shippingAddress: "789 Pine Rd, Seattle, WA 98101, USA",
        notes: [
          "Order received and awaiting payment confirmation"
        ],
        createdAt: "2024-01-13T09:15:00Z",
        updatedAt: "2024-01-13T09:15:00Z"
      },
      {
        orderId: "ORD-004",
        customerName: "Emily Wilson",
        customerEmail: "emily.w@email.com",
        orderAmount: 799.99,
        orderDate: "2024-01-12T16:45:00Z",
        description: "Smart home automation bundle",
        status: "completed",
        invoiceFileUrl: "/uploads/invoices/invoice-004.pdf",
        invoiceFileName: "invoice-004.pdf",
        paymentMethod: "Credit Card (**** 1234)",
        shippingAddress: "321 Cedar St, Denver, CO 80201, USA",
        notes: [
          "Order received and confirmed",
          "Payment processed successfully",
          "Items shipped and delivered"
        ],
        createdAt: "2024-01-12T16:45:00Z",
        updatedAt: "2024-01-14T10:20:00Z"
      },
      {
        orderId: "ORD-005",
        customerName: "David Brown",
        customerEmail: "david.brown@email.com",
        orderAmount: 1599.00,
        orderDate: "2024-01-11T11:30:00Z",
        description: "Professional audio equipment",
        status: "cancelled",
        invoiceFileUrl: "/uploads/invoices/invoice-005.pdf",
        invoiceFileName: "invoice-005.pdf",
        paymentMethod: "Credit Card (**** 5678)",
        shippingAddress: "654 Birch Ave, Austin, TX 73301, USA",
        notes: [
          "Order received",
          "Customer requested cancellation",
          "Refund processed"
        ],
        createdAt: "2024-01-11T11:30:00Z",
        updatedAt: "2024-01-12T14:15:00Z"
      }
    ];

    this.orders = sampleOrders;
  }

  async createOrder(orderData: CreateOrderRequest, invoiceFile?: Express.Multer.File): Promise<Order> {
    const orderId = `ORD-${String(this.orders.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    
    const newOrder: Order = {
      orderId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      orderAmount: orderData.orderAmount,
      orderDate: now,
      description: orderData.description,
      status: "pending",
      invoiceFileUrl: invoiceFile ? `/uploads/invoices/${invoiceFile.filename}` : undefined,
      invoiceFileName: invoiceFile?.originalname,
      paymentMethod: orderData.paymentMethod,
      shippingAddress: orderData.shippingAddress,
      notes: ["Order received and awaiting confirmation"],
      createdAt: now,
      updatedAt: now,
    };

    this.orders.unshift(newOrder);

    // Create notification
    this.createNotification({
      type: "order_created",
      title: "New Order Created",
      message: `Order ${orderId} has been created for ${orderData.customerName}`,
      orderId: orderId,
    });

    return newOrder;
  }

  async getOrders(query: OrderQuery): Promise<{ orders: Order[]; total: number }> {
    let filteredOrders = [...this.orders];

    // Apply filters
    if (query.status) {
      filteredOrders = filteredOrders.filter(order => order.status === query.status);
    }

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order => 
        order.orderId.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower) ||
        order.customerEmail?.toLowerCase().includes(searchLower)
      );
    }

    if (query.dateFrom) {
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.orderDate) >= new Date(query.dateFrom!)
      );
    }

    if (query.dateTo) {
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.orderDate) <= new Date(query.dateTo!)
      );
    }

    // Apply sorting
    filteredOrders.sort((a, b) => {
      const aValue = a[query.sortBy!];
      const bValue = b[query.sortBy!];
      
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;
      
      return query.sortOrder === "asc" ? comparison : -comparison;
    });

    const total = filteredOrders.length;
    const startIndex = (query.page! - 1) * query.limit!;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + query.limit!);

    return { orders: paginatedOrders, total };
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return this.orders.find(order => order.orderId === orderId) || null;
  }

  async updateOrder(orderId: string, updateData: UpdateOrderRequest): Promise<Order | null> {
    const orderIndex = this.orders.findIndex(order => order.orderId === orderId);
    if (orderIndex === -1) return null;

    const existingOrder = this.orders[orderIndex];
    const updatedOrder: Order = {
      ...existingOrder,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    // Add status change note
    if (updateData.status && updateData.status !== existingOrder.status) {
      updatedOrder.notes = [
        ...existingOrder.notes,
        `Status changed from ${existingOrder.status} to ${updateData.status}`
      ];

      // Create notification for status change
      this.createNotification({
        type: "order_updated",
        title: "Order Status Updated",
        message: `Order ${orderId} status changed to ${updateData.status}`,
        orderId: orderId,
      });
    }

    this.orders[orderIndex] = updatedOrder;
    return updatedOrder;
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    const orderIndex = this.orders.findIndex(order => order.orderId === orderId);
    if (orderIndex === -1) return false;

    this.orders.splice(orderIndex, 1);
    return true;
  }

  async getAnalytics(): Promise<OrderAnalytics> {
    const totalOrders = this.orders.length;
    const completedOrders = this.orders.filter(order => order.status === "completed");
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.orderAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const completionRate = totalOrders > 0 ? (completedOrders.length / totalOrders) * 100 : 0;

    // Status breakdown
    const statusBreakdown: Record<OrderStatus, number> = {
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    };

    this.orders.forEach(order => {
      statusBreakdown[order.status]++;
    });

    // Revenue by month (last 6 months)
    const revenueByMonth = this.calculateRevenueByMonth();

    // Top customers
    const topCustomers = this.calculateTopCustomers();

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      completionRate,
      statusBreakdown,
      revenueByMonth,
      topCustomers,
    };
  }

  private calculateRevenueByMonth() {
    const monthlyData = new Map<string, { revenue: number; orders: number }>();
    
    this.orders.forEach(order => {
      const month = new Date(order.orderDate).toISOString().slice(0, 7); // YYYY-MM
      const existing = monthlyData.get(month) || { revenue: 0, orders: 0 };
      
      monthlyData.set(month, {
        revenue: existing.revenue + (order.status === "completed" ? order.orderAmount : 0),
        orders: existing.orders + 1,
      });
    });

    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private calculateTopCustomers() {
    const customerData = new Map<string, { totalOrders: number; totalRevenue: number }>();
    
    this.orders.forEach(order => {
      const existing = customerData.get(order.customerName) || { totalOrders: 0, totalRevenue: 0 };
      
      customerData.set(order.customerName, {
        totalOrders: existing.totalOrders + 1,
        totalRevenue: existing.totalRevenue + (order.status === "completed" ? order.orderAmount : 0),
      });
    });

    return Array.from(customerData.entries())
      .map(([customerName, data]) => ({ customerName, ...data }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);
  }

  private createNotification(notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const notification: Notification = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notificationData,
    };

    this.notifications.unshift(notification);
    
    // Keep only last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }
  }

  async getNotifications(limit: number = 10): Promise<Notification[]> {
    return this.notifications.slice(0, limit);
  }

  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }

  async bulkUpdateOrders(orderIds: string[], updateData: UpdateOrderRequest): Promise<Order[]> {
    const updatedOrders: Order[] = [];
    
    for (const orderId of orderIds) {
      const updated = await this.updateOrder(orderId, updateData);
      if (updated) {
        updatedOrders.push(updated);
      }
    }

    return updatedOrders;
  }

  async getOrdersForExport(filters?: Partial<OrderQuery>): Promise<Order[]> {
    const query: OrderQuery = {
      page: 1,
      limit: 1000, // Export all matching orders
      sortBy: "orderDate",
      sortOrder: "desc",
      ...filters,
    };

    const { orders } = await this.getOrders(query);
    return orders;
  }
}

export const orderService = new OrderService();
