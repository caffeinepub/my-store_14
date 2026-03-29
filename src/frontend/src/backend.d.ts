import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

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

export type UserRole = { admin: null } | { user: null } | { guest: null };

export interface backendInterface {
    // Auth
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;

    // Products
    listProducts(): Promise<Product[]>;
    getProduct(id: string): Promise<Option<Product>>;
    createProduct(name: string, description: string, price: bigint, stock: bigint, imageId: string): Promise<Product>;
    updateProduct(id: string, name: string, description: string, price: bigint, stock: bigint, imageId: string): Promise<Option<Product>>;
    deleteProduct(id: string): Promise<boolean>;

    // Orders
    placeOrder(customerName: string, customerEmail: string, items: OrderItem[]): Promise<Order>;
    listOrders(): Promise<Order[]>;
    fulfillOrder(id: string): Promise<Option<Order>>;
}
