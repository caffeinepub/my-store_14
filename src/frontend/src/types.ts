// Shared domain types matching the backend interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: bigint;
  stock: bigint;
  imageId: string;
}

export interface OrderItem {
  productId: string;
  quantity: bigint;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  fulfilled: boolean;
  createdAt: bigint;
}
