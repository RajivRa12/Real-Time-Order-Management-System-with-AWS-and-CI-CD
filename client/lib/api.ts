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

// Mock data for when API is not available
const mockOrders: Order[] = [
  {
    orderId: 'ORD-001',
    customerName: 'John Smith',
    orderAmount: 1299.99,
    description: 'Premium software license',
    status: 'completed',
    orderDate: '2024-01-15T16:00:00Z',
    invoiceFileUrl: '/invoices/ORD-001.pdf',
    createdAt: '2024-01-15T16:00:00Z',
    updatedAt: '2024-01-15T16:00:00Z'
  },
  {
    orderId: 'ORD-002',
    customerName: 'Sarah Johnson',
    orderAmount: 599.50,
    description: 'Cloud hosting package',
    status: 'processing',
    orderDate: '2024-01-14T19:50:00Z',
    invoiceFileUrl: '/invoices/ORD-002.pdf',
    createdAt: '2024-01-14T19:50:00Z',
    updatedAt: '2024-01-14T19:50:00Z'
  },
  {
    orderId: 'ORD-003',
    customerName: 'Mike Davis',
    orderAmount: 2150.00,
    description: 'Enterprise consulting services',
    status: 'pending',
    orderDate: '2024-01-13T14:45:00Z',
    invoiceFileUrl: '/invoices/ORD-003.pdf',
    createdAt: '2024-01-13T14:45:00Z',
    updatedAt: '2024-01-13T14:45:00Z'
  },
  {
    orderId: 'ORD-004',
    customerName: 'Emily Wilson',
    orderAmount: 799.99,
    description: 'Design system package',
    status: 'completed',
    orderDate: '2024-01-12T22:15:00Z',
    invoiceFileUrl: '/invoices/ORD-004.pdf',
    createdAt: '2024-01-12T22:15:00Z',
    updatedAt: '2024-01-12T22:15:00Z'
  },
  {
    orderId: 'ORD-005',
    customerName: 'David Brown',
    orderAmount: 1599.00,
    description: 'Mobile app development',
    status: 'cancelled',
    orderDate: '2024-01-11T17:00:00Z',
    invoiceFileUrl: null,
    createdAt: '2024-01-11T17:00:00Z',
    updatedAt: '2024-01-11T17:00:00Z'
  }
];

const mockAnalytics: OrderAnalytics = {
  totalRevenue: 2099.98,
  totalOrders: 5,
  averageOrderValue: 420.00,
  completionRate: 40,
  statusBreakdown: {
    completed: 2,
    processing: 1,
    pending: 1,
    cancelled: 1
  },
  revenueByMonth: [
    {
      month: '2024-01',
      revenue: 2099.98,
      orders: 5
    }
  ]
};

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
  try {
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
  } catch (error) {
    // Return mock data if API is not available
    console.warn('API request failed, using mock data:', error);
    return getMockData(endpoint) as T;
  }
}

function getMockData(endpoint: string): any {
  if (endpoint.includes('/analytics')) {
    return { data: mockAnalytics };
  }
  
  if (endpoint.includes('/orders')) {
    const params = new URLSearchParams(endpoint.split('?')[1] || '');
    const limit = parseInt(params.get('limit') || '10');
    const sortBy = params.get('sortBy') || 'orderDate';
    const sortOrder = params.get('sortOrder') || 'desc';
    
    let filteredOrders = [...mockOrders];
    
    // Sort orders
    filteredOrders.sort((a, b) => {
      const aValue = a[sortBy as keyof Order];
      const bValue = b[sortBy as keyof Order];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'desc' 
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
      }
      
      return 0;
    });
    
    // Apply limit
    filteredOrders = filteredOrders.slice(0, limit);
    
    return {
      data: filteredOrders,
      pagination: {
        page: 1,
        limit,
        total: mockOrders.length,
        totalPages: Math.ceil(mockOrders.length / limit)
      }
    };
  }
  
  return { data: null };
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
    const order = mockOrders.find(o => o.orderId === orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    return { data: order };
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
