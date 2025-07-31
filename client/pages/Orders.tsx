import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Search,
  Download,
  Eye,
  Filter,
  SortAsc,
  SortDesc
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Order {
  orderId: string;
  customerName: string;
  orderAmount: number;
  orderDate: string;
  invoiceFileUrl: string;
  status: "pending" | "processing" | "completed" | "cancelled";
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof Order>("orderDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders([
        {
          orderId: "ORD-001",
          customerName: "John Smith",
          orderAmount: 1299.99,
          orderDate: "2024-01-15T10:30:00Z",
          invoiceFileUrl: "#",
          status: "completed"
        },
        {
          orderId: "ORD-002", 
          customerName: "Sarah Johnson",
          orderAmount: 599.50,
          orderDate: "2024-01-14T14:20:00Z",
          invoiceFileUrl: "#",
          status: "processing"
        },
        {
          orderId: "ORD-003",
          customerName: "Mike Davis",
          orderAmount: 2150.00,
          orderDate: "2024-01-13T09:15:00Z",
          invoiceFileUrl: "#",
          status: "pending"
        },
        {
          orderId: "ORD-004",
          customerName: "Emily Wilson",
          orderAmount: 799.99,
          orderDate: "2024-01-12T16:45:00Z",
          invoiceFileUrl: "#",
          status: "completed"
        },
        {
          orderId: "ORD-005",
          customerName: "David Brown",
          orderAmount: 1599.00,
          orderDate: "2024-01-11T11:30:00Z",
          invoiceFileUrl: "#",
          status: "cancelled"
        },
        {
          orderId: "ORD-006",
          customerName: "Lisa Martinez",
          orderAmount: 899.99,
          orderDate: "2024-01-10T13:20:00Z",
          invoiceFileUrl: "#",
          status: "completed"
        },
        {
          orderId: "ORD-007",
          customerName: "Tom Anderson",
          orderAmount: 1799.50,
          orderDate: "2024-01-09T08:45:00Z",
          invoiceFileUrl: "#",
          status: "processing"
        },
        {
          orderId: "ORD-008",
          customerName: "Jennifer Lee",
          orderAmount: 649.99,
          orderDate: "2024-01-08T15:30:00Z",
          invoiceFileUrl: "#",
          status: "pending"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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

  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;
      
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const SortButton = ({ field, children }: { field: keyof Order; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      <span className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
        )}
      </span>
    </Button>
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Orders</h1>
            <p className="text-muted-foreground">
              Manage and track all customer orders
            </p>
          </div>
          <Button asChild>
            <Link to="/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
            <CardDescription>
              Filter and search through your orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order ID or customer name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Orders ({filteredAndSortedOrders.length})</CardTitle>
                <CardDescription>
                  {statusFilter === "all" ? "All orders" : `${statusFilter} orders`} matching your criteria
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <SortButton field="orderId">Order ID</SortButton>
                      </TableHead>
                      <TableHead>
                        <SortButton field="customerName">Customer</SortButton>
                      </TableHead>
                      <TableHead>
                        <SortButton field="orderAmount">Amount</SortButton>
                      </TableHead>
                      <TableHead>
                        <SortButton field="orderDate">Date</SortButton>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-muted-foreground">
                            {searchTerm || statusFilter !== "all" 
                              ? "No orders match your filters" 
                              : "No orders found"
                            }
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAndSortedOrders.map((order) => (
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
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
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
