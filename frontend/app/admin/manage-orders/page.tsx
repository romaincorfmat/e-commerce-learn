"use client";

import useGetOrders from "@/hooks/orders/useGetOrders";
import React, { useState } from "react";
import { Order } from "@/types/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, Eye, Search } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";

const ManageOrdersPage = () => {
  const { data, isLoading, error } = useGetOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading orders...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-destructive">
              <p>Failed to load orders</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const orders: Order[] = data?.data || [];

  console.log("Orders", orders);

  const filteredOrders = statusFilter
    ? orders.filter((order) => order.status === statusFilter)
    : orders;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Orders</CardTitle>
              <CardDescription>View and manage customer orders</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search orders..."
                  className="rounded-md border border-input pl-8 h-9 w-[200px] sm:w-[300px]"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Status <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    All Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("completed")}
                  >
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("cancelled")}
                  >
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        {order._id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>{order.user._id.substring(0, 8)}...</TableCell>
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{formatPrice(order.totalPrice)}</TableCell>
                      <TableCell>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto p-4">
                            {selectedOrder && (
                              <>
                                <SheetHeader>
                                  <SheetTitle>Order Details</SheetTitle>
                                  <SheetDescription>
                                    Order ID: {selectedOrder._id}
                                  </SheetDescription>
                                </SheetHeader>
                                <div className="space-y-6 py-6">
                                  <div>
                                    <h3 className="text-sm font-medium">
                                      Order Information
                                    </h3>
                                    <div className="mt-2 text-sm">
                                      <p>User ID: {selectedOrder.user._id}</p>
                                      <p className="text-red-500">
                                        Shopping Cart ID: To fix in controller
                                        as all null
                                        {/* {typeof selectedOrder.shoppingCartId ===
                                        "string"
                                          ? selectedOrder.shoppingCartId
                                          : String(
                                              selectedOrder.shoppingCartId
                                            )} */}
                                        {selectedOrder.shoppingCart &&
                                        typeof selectedOrder.shoppingCart ===
                                          "object"
                                          ? (
                                              selectedOrder.shoppingCart as {
                                                _id: string;
                                              }
                                            )._id
                                          : "N/A"}
                                      </p>
                                      <p>
                                        Order Date:{" "}
                                        {formatDate(selectedOrder.orderDate)}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">
                                      Order Items
                                    </h3>
                                    <div className="mt-2 border rounded-md">
                                      {selectedOrder.items.map(
                                        (item, index) => (
                                          <div
                                            key={index}
                                            className="flex justify-between py-3 px-4 border-b last:border-b-0"
                                          >
                                            <div>
                                              <p className="font-medium">
                                                Product ID:{" "}
                                                {typeof item.product._id ===
                                                "string"
                                                  ? item.product._id.substring(
                                                      0,
                                                      8
                                                    )
                                                  : String(
                                                      item.product._id
                                                    ).substring(0, 8)}
                                                ...
                                              </p>
                                              <p className="text-sm text-muted-foreground">
                                                SKU:{" "}
                                                {item.productVariant.productSku}
                                              </p>
                                              <p className="text-sm text-muted-foreground">
                                                Qty:{" "}
                                                {item.productVariant.quantity}
                                              </p>
                                              <p className="text-sm text-muted-foreground">
                                                Unit Price:{" "}
                                                {formatPrice(
                                                  item.productVariant.unitPrice
                                                )}
                                              </p>
                                            </div>
                                            <p className="font-medium">
                                              {formatPrice(item.totalPrice)}
                                            </p>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">
                                      Order Summary
                                    </h3>
                                    <div className="mt-2 space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <p>Status</p>
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                            selectedOrder.status
                                          )}`}
                                        >
                                          {selectedOrder.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            selectedOrder.status.slice(1)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-sm pt-2 border-t">
                                        <p className="font-bold">Total</p>
                                        <p className="font-bold">
                                          {formatPrice(
                                            selectedOrder.totalPrice
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                  <Button variant="outline">Cancel</Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button>Update Status</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>
                                        Pending
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        Completed
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-destructive">
                                        Cancelled
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </>
                            )}
                          </SheetContent>
                        </Sheet>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageOrdersPage;
