import { 
  Order, 
  CreateOrderRequest, 
  UpdateOrderRequest, 
  OrderQuery, 
  ApiResponse, 
  PaginatedResponse,
  OrderAnalytics,
  Notification
} from "@shared/orders";

const API_BASE = '/api';

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.error || 'Request failed', data);
  }

  return data;
}

export const ordersApi = {
  // Get orders with filtering and pagination
  async getOrders(query: Partial<OrderQuery> = {}): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const endpoint = `/orders${params.toString() ? `?${params.toString()}` : ''}`;
    return apiRequest<PaginatedResponse<Order>>(endpoint);
  },

  // Get single order by ID
  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    return apiRequest<ApiResponse<Order>>(`/orders/${orderId}`);
  },

  // Create new order
  async createOrder(orderData: CreateOrderRequest, invoiceFile?: File): Promise<ApiResponse<Order>> {
    const formData = new FormData();
    
    // Add order data
    Object.entries(orderData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Add file if provided
    if (invoiceFile) {
      formData.append('invoiceFile', invoiceFile);
    }

    return apiRequest<ApiResponse<Order>>('/orders', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set boundary for FormData
      body: formData,
    });
  },

  // Update order
  async updateOrder(orderId: string, updateData: UpdateOrderRequest): Promise<ApiResponse<Order>> {
    return apiRequest<ApiResponse<Order>>(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete order
  async deleteOrder(orderId: string): Promise<ApiResponse> {
    return apiRequest<ApiResponse>(`/orders/${orderId}`, {
      method: 'DELETE',
    });
  },

  // Bulk update orders
  async bulkUpdateOrders(orderIds: string[], updateData: UpdateOrderRequest): Promise<ApiResponse<Order[]>> {
    return apiRequest<ApiResponse<Order[]>>('/orders/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ orderIds, updateData }),
    });
  },

  // Get analytics
  async getAnalytics(): Promise<ApiResponse<OrderAnalytics>> {
    return apiRequest<ApiResponse<OrderAnalytics>>('/orders/analytics');
  },

  // Download invoice
  downloadInvoice(orderId: string): string {
    return `${API_BASE}/orders/${orderId}/download-invoice`;
  },
};

export const notificationsApi = {
  // Get notifications
  async getNotifications(limit: number = 10): Promise<ApiResponse<Notification[]>> {
    return apiRequest<ApiResponse<Notification[]>>(`/notifications?limit=${limit}`);
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<ApiResponse> {
    return apiRequest<ApiResponse>(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },
};

export { ApiError };
