import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order, OrderItem, Product } from "../types";
import { useActor } from "./useActor";

// Cast actor to any to work around generated backend.ts having empty backendInterface
// The actual methods exist at runtime via the Backend class
type ActorAny = any;

export function useProducts() {
  const { actor, isFetching } = useActor();
  const a = actor as ActorAny;
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!a) return [];
      return a.listProducts();
    },
    enabled: !!a && !isFetching,
  });
}

export function useOrders() {
  const { actor, isFetching } = useActor();
  const a = actor as ActorAny;
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!a) return [];
      return a.listOrders();
    },
    enabled: !!a && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  const a = actor as ActorAny;
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!a) return false;
      return a.isCallerAdmin();
    },
    enabled: !!a && !isFetching,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      customerName,
      customerEmail,
      items,
    }: {
      customerName: string;
      customerEmail: string;
      items: OrderItem[];
    }) => {
      const a = actor as ActorAny;
      if (!a) throw new Error("Not connected");
      return a.placeOrder(customerName, customerEmail, items) as Promise<Order>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      name: string;
      description: string;
      price: bigint;
      stock: bigint;
      imageId: string;
    }) => {
      const a = actor as ActorAny;
      if (!a) throw new Error("Not connected");
      return a.createProduct(
        p.name,
        p.description,
        p.price,
        p.stock,
        p.imageId,
      ) as Promise<Product>;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      id: string;
      name: string;
      description: string;
      price: bigint;
      stock: bigint;
      imageId: string;
    }) => {
      const a = actor as ActorAny;
      if (!a) throw new Error("Not connected");
      return a.updateProduct(
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.imageId,
      ) as Promise<Product>;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const a = actor as ActorAny;
      if (!a) throw new Error("Not connected");
      return a.deleteProduct(id) as Promise<boolean>;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useFulfillOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const a = actor as ActorAny;
      if (!a) throw new Error("Not connected");
      return a.fulfillOrder(id) as Promise<Order>;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
}
