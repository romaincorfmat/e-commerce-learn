export interface ProductVariant {
  productSku: string;
  quantity: number;
}

export interface OrderItem {
  _id?: string;
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  productVariant: ProductVariant;
  totalPrice: number;
  addedAt?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  user: { _id: string; name: string; email: string };
  shoppingCart: string;
  items: OrderItem[];
  totalPrice: number;
  orderDate: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
  error?: {
    message: string;
  };
}
