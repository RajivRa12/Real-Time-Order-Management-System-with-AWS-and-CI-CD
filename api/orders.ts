import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  switch (req.method) {
    case 'GET':
      return getOrders(req, res);
    case 'POST':
      return createOrder(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getOrders(req: VercelRequest, res: VercelResponse) {
  try {
    // Mock data for demonstration
    const orders = [
      {
        id: '1',
        customerName: 'John Doe',
        orderAmount: 150.00,
        description: 'Sample order',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        customerName: 'Jane Smith',
        orderAmount: 250.00,
        description: 'Another sample order',
        status: 'completed',
        createdAt: new Date().toISOString()
      }
    ];

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createOrder(req: VercelRequest, res: VercelResponse) {
  try {
    const { customerName, orderAmount, description } = req.body;

    // Validate required fields
    if (!customerName || !orderAmount) {
      return res.status(400).json({ error: 'Customer name and order amount are required' });
    }

    // Mock order creation
    const newOrder = {
      id: Date.now().toString(),
      customerName,
      orderAmount: parseFloat(orderAmount),
      description: description || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // In a real application, you would save this to a database
    console.log('New order created:', newOrder);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 