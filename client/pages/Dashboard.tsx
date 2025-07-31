import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Plus,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Download,
  ExternalLink,
  Eye,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ordersApi } from "@/lib/api";
import type { Order, OrderAnalytics } from "@shared/orders";

export default function Dashboard() {
  // Fetch recent orders
  const { data: ordersResponse, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', { limit: 5, sortBy: 'orderDate', sortOrder: 'desc' }],
    queryFn: () => ordersApi.getOrders({ limit: 5, sortBy: 'orderDate', sortOrder: 'desc' }),
  });

  // Fetch analytics
  const { data: analyticsResponse, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => ordersApi.getAnalytics(),
  });

  const orders = ordersResponse?.data || [];
  const analytics = analyticsResponse?.data;
  const isLoading = ordersLoading || analyticsLoading;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300";
      case "processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Prepare chart data
  const revenueChartData = analytics?.revenueByMonth?.map(item => ({
    name: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    revenue: item.revenue,
    orders: item.orders,
  })) || [];

  const statusChartData = analytics ? [
    { name: 'Completed', value: analytics.statusBreakdown.completed, color: '#10b981' },
    { name: 'Processing', value: analytics.statusBreakdown.processing, color: '#3b82f6' },
    { name: 'Pending', value: analytics.statusBreakdown.pending, color: '#f59e0b' },
    { name: 'Cancelled', value: analytics.statusBreakdown.cancelled, color: '#ef4444' },
  ].filter(item => item.value > 0) : [];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your order management system performance
            </p>
          </div>
          <Button asChild>
            <Link to="/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <div className="text-2xl font-bold">...</div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{formatCurrency(analytics?.totalRevenue || 0)}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    From completed orders
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <div className="text-2xl font-bold">...</div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{analytics?.totalOrders || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics?.statusBreakdown.completed || 0} completed
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Order Value
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <div className="text-2xl font-bold">...</div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{formatCurrency(analytics?.averageOrderValue || 0)}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics?.statusBreakdown.pending || 0} pending orders
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <div className="text-2xl font-bold">...</div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {Math.round(analytics?.completionRate || 0)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analytics?.statusBreakdown.completed || 0} of {analytics?.totalOrders || 0} orders
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>
                Monthly revenue and order trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-80">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="name"
                      className="text-muted-foreground"
                      fontSize={12}
                    />
                    <YAxis
                      className="text-muted-foreground"
                      fontSize={12}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      formatter={(value: any, name: string) => [
                        name === 'revenue' ? formatCurrency(value) : value,
                        name === 'revenue' ? 'Revenue' : 'Orders'
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>
              <CardDescription>
                Breakdown of orders by current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-80">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [value, 'Orders']}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="grid grid-cols-2 gap-4">
                    {statusChartData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {item.name}: {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  A list of your recent orders including customer details and status.
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link to="/orders">
                  View All Orders
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-muted-foreground">
                            No orders found
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow key={order.orderId}>
                          <TableCell className="font-medium">
                            {order.orderId}
                          </TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{formatCurrency(order.orderAmount)}</TableCell>
                          <TableCell>{formatDate(order.orderDate)}</TableCell>
                          <TableCell>
                            <Badge
                              className={cn(
                                "capitalize",
                                getStatusColor(order.status)
                              )}
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {order.invoiceFileUrl ? (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={ordersApi.downloadInvoice(order.orderId)} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-sm">No invoice</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/orders/${order.orderId}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
