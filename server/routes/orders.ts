import express, { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  CreateOrderSchema,
  UpdateOrderSchema,
  OrderQuerySchema,
  ApiResponse,
  PaginatedResponse,
  Order
} from "../../shared/orders.js";
import { orderService } from "../services/orderService";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'invoices');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `invoice-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// GET /api/orders - Get all orders with pagination and filtering
export const getOrders: RequestHandler = async (req, res) => {
  try {
    const queryResult = OrderQuerySchema.safeParse(req.query);
    
    if (!queryResult.success) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid query parameters",
        data: queryResult.error.issues
      };
      return res.status(400).json(response);
    }

    const query = queryResult.data;
    const { orders, total } = await orderService.getOrders(query);

    const response: PaginatedResponse<Order> = {
      success: true,
      data: orders,
      pagination: {
        page: query.page!,
        limit: query.limit!,
        total,
        totalPages: Math.ceil(total / query.limit!)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching orders:', error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch orders"
    };
    res.status(500).json(response);
  }
};

// POST /api/orders - Create new order
export const createOrder: RequestHandler = async (req, res) => {
  try {
    const validationResult = CreateOrderSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid order data",
        data: validationResult.error.issues
      };
      return res.status(400).json(response);
    }

    const orderData = validationResult.data;
    const invoiceFile = req.file;

    const newOrder = await orderService.createOrder(orderData, invoiceFile);

    const response: ApiResponse<Order> = {
      success: true,
      data: newOrder,
      message: "Order created successfully"
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating order:', error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to create order"
    };
    res.status(500).json(response);
  }
};

// GET /api/orders/:id - Get order by ID
export const getOrderById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);

    if (!order) {
      const response: ApiResponse = {
        success: false,
        error: "Order not found"
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Order> = {
      success: true,
      data: order
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching order:', error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch order"
    };
    res.status(500).json(response);
  }
};

// PUT /api/orders/:id - Update order
export const updateOrder: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const validationResult = UpdateOrderSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid update data",
        data: validationResult.error.issues
      };
      return res.status(400).json(response);
    }

    const updateData = validationResult.data;
    const updatedOrder = await orderService.updateOrder(id, updateData);

    if (!updatedOrder) {
      const response: ApiResponse = {
        success: false,
        error: "Order not found"
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Order> = {
      success: true,
      data: updatedOrder,
      message: "Order updated successfully"
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating order:', error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to update order"
    };
    res.status(500).json(response);
  }
};

// DELETE /api/orders/:id - Delete order
export const deleteOrder: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await orderService.deleteOrder(id);

    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: "Order not found"
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      message: "Order deleted successfully"
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting order:', error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to delete order"
    };
    res.status(500).json(response);
  }
};

// GET /api/orders/analytics - Get order analytics
export const getAnalytics: RequestHandler = async (req, res) => {
  try {
    const analytics = await orderService.getAnalytics();

    const response: ApiResponse = {
      success: true,
      data: analytics
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch analytics"
    };
    res.status(500).json(response);
  }
};

// POST /api/orders/bulk-update - Bulk update orders
export const bulkUpdateOrders: RequestHandler = async (req, res) => {
  try {
    const { orderIds, updateData } = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "orderIds must be a non-empty array"
      };
      return res.status(400).json(response);
    }

    const validationResult = UpdateOrderSchema.safeParse(updateData);
    
    if (!validationResult.success) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid update data",
        data: validationResult.error.issues
      };
      return res.status(400).json(response);
    }

    const updatedOrders = await orderService.bulkUpdateOrders(orderIds, validationResult.data);

    const response: ApiResponse<Order[]> = {
      success: true,
      data: updatedOrders,
      message: `${updatedOrders.length} orders updated successfully`
    };

    res.json(response);
  } catch (error) {
    console.error('Error bulk updating orders:', error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to bulk update orders"
    };
    res.status(500).json(response);
  }
};

// GET /api/orders/:id/download-invoice - Download invoice
export const downloadInvoice: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);

    if (!order || !order.invoiceFileUrl) {
      const response: ApiResponse = {
        success: false,
        error: "Invoice not found"
      };
      return res.status(404).json(response);
    }

    const filePath = path.join(process.cwd(), order.invoiceFileUrl);
    
    if (!fs.existsSync(filePath)) {
      const response: ApiResponse = {
        success: false,
        error: "Invoice file not found on server"
      };
      return res.status(404).json(response);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${order.invoiceFileName || `invoice-${id}.pdf`}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading invoice:', error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to download invoice"
    };
    res.status(500).json(response);
  }
};

// Setup routes
router.get('/', getOrders);
router.post('/', upload.single('invoiceFile'), createOrder);
router.get('/analytics', getAnalytics);
router.post('/bulk-update', bulkUpdateOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.get('/:id/download-invoice', downloadInvoice);

export default router;
