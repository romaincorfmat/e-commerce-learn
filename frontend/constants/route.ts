export const ADMIN_ROUTES = {
  DASHBOARD: "/admin/dashboard",
  ORDERS: "/admin/manage-orders",
  STOCK_ENTRY: "/admin/stock-entry",
  PRODUCTS: "/admin/manage-products",
  CATEGORIES: "/admin/manage-categories",
  SUPPLIERS: "/admin/manage-suppliers",
  CUSTOMERS: "/admin/manage-customers",
  REPORTS: "/admin/reports",
  USERS: "/admin/manage-users",
};

export const CUSTOMER_ROUTES = {
  HOME: "/home",
  PRODUCTS: "/products",
  ORDERS: "/orders",
  PROFILE: "/profile",
  CART: "/carts",
  WISHLIST: "/wishlist",
};

export const NOT_FOUND = {
  CARTS: "/not-found/carts",
  ORDERS: "/not-found/orders",
};

// Helper functions for dynamic routes
export const getCartRoute = (userId: string): string => {
  return `${CUSTOMER_ROUTES.CART}/${userId}`;
};

export const getOrderRoute = (userId: string): string =>
  `${CUSTOMER_ROUTES.ORDERS}/${userId}`;
