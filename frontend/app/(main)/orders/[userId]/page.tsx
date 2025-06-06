"use client";

import { useUser } from "@/contexts/UserContext";
import useGetCustomerOrders from "@/hooks/orders/useGetCustomerOrders";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Eye, Package } from "lucide-react";
import { formatDate, formatPrice, getOrderStatusColor } from "@/lib/utils";
import Link from "next/link";

const CustomerOrderPage = () => {
  const { user } = useUser();
  const { data, isLoading } = useGetCustomerOrders(user?._id || "");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-destructive">
                  Access Denied
                </h2>
                <p className="mt-2 text-gray-500">
                  You need to be logged in to view your orders
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">
                  Loading your orders...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orders = data?.data || [];

  if (orders.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>View and track your order history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-64">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No orders found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You haven&apos;t placed any orders yet
              </p>
              <Link href="/products" className="mt-4">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>View and track your order history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono text-xs">
                    {order._id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(
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
                          onClick={() =>
                            setSelectedOrder(order as unknown as Order)
                          }
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
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
                                <div className="mt-2 text-sm space-y-1">
                                  <p>
                                    Order Date:{" "}
                                    {formatDate(selectedOrder.orderDate)}
                                  </p>
                                  <p>
                                    Status:
                                    <span
                                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(
                                        selectedOrder.status
                                      )}`}
                                    >
                                      {selectedOrder.status
                                        .charAt(0)
                                        .toUpperCase() +
                                        selectedOrder.status.slice(1)}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              <div>
                                <h3 className="text-sm font-medium">Items</h3>
                                <div className="mt-2 divide-y">
                                  {selectedOrder.items.map((item) => (
                                    <div key={item._id} className="py-3">
                                      <div className="flex justify-between">
                                        <div className="flex-1">
                                          <p className="font-medium">
                                            {item.product.name}
                                          </p>
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {Object.entries(
                                              item.productVariant
                                            ).map(
                                              ([key, value]) =>
                                                key !== "_id" && (
                                                  <span
                                                    key={key}
                                                    className="bg-gray-100 px-2 py-0.5 rounded-md text-xs"
                                                  >
                                                    {key}: {String(value)}
                                                  </span>
                                                )
                                            )}
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <p>{formatPrice(item.totalPrice)}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h3 className="text-sm font-medium">
                                  Order Summary
                                </h3>
                                <div className="mt-2 pt-2 border-t">
                                  <div className="flex justify-between text-sm font-bold">
                                    <p>Total</p>
                                    <p>
                                      {formatPrice(selectedOrder.totalPrice)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </SheetContent>
                    </Sheet>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerOrderPage;
