import type { Option } from "./backend";
// Augment the backend module to add the actual methods declared in backend.d.ts
// We augment both backendInterface and Backend class so the implements check passes.
import type { Order, OrderItem, Product } from "./types";

type UserRole = { admin: null } | { user: null } | { guest: null };

declare module "./backend" {
  interface backendInterface {
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    listProducts(): Promise<Product[]>;
    getProduct(id: string): Promise<Option<Product>>;
    createProduct(
      name: string,
      description: string,
      price: bigint,
      stock: bigint,
      imageId: string,
    ): Promise<Product>;
    updateProduct(
      id: string,
      name: string,
      description: string,
      price: bigint,
      stock: bigint,
      imageId: string,
    ): Promise<Option<Product>>;
    deleteProduct(id: string): Promise<boolean>;
    placeOrder(
      customerName: string,
      customerEmail: string,
      items: OrderItem[],
    ): Promise<Order>;
    listOrders(): Promise<Order[]>;
    fulfillOrder(id: string): Promise<Option<Order>>;
  }

  interface Backend {
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    listProducts(): Promise<Product[]>;
    getProduct(id: string): Promise<Option<Product>>;
    createProduct(
      name: string,
      description: string,
      price: bigint,
      stock: bigint,
      imageId: string,
    ): Promise<Product>;
    updateProduct(
      id: string,
      name: string,
      description: string,
      price: bigint,
      stock: bigint,
      imageId: string,
    ): Promise<Option<Product>>;
    deleteProduct(id: string): Promise<boolean>;
    placeOrder(
      customerName: string,
      customerEmail: string,
      items: OrderItem[],
    ): Promise<Order>;
    listOrders(): Promise<Order[]>;
    fulfillOrder(id: string): Promise<Option<Order>>;
  }
}
