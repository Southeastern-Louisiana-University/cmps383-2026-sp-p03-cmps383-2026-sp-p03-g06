import { CreateOrderItemDto } from "@/services/types";
import React, { createContext, useCallback, useContext, useState } from "react";

interface OrderContextData {
  selectedLocationId: number | null;
  orderItems: CreateOrderItemDto[];
  locationName: string | null;
  locationAddress: string | null;

  setLocation: (
    locationId: number,
    locationName: string,
    locationAddress: string,
  ) => void;

  addOrderItem: (item: CreateOrderItemDto) => void;

  removeOrderItem: (menuItemId: number, customizationJson?: string) => void;

  updateOrderItemQuantity: (
    menuItemId: number,
    customizationJson: string | undefined,
    quantity: number,
  ) => void;

  clearOrder: () => void;

  orderTotal: number;
  itemCount: number;
}

const OrderContext = createContext<OrderContextData | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null,
  );
  const [locationName, setLocationName] = useState<string | null>(null);
  const [locationAddress, setLocationAddress] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<CreateOrderItemDto[]>([]);

  const setLocation = useCallback(
    (locationId: number, name: string, address: string) => {
      setSelectedLocationId(locationId);
      setLocationName(name);
      setLocationAddress(address);
    },
    [],
  );

  const addOrderItem = useCallback((newItem: CreateOrderItemDto) => {
    setOrderItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item.menuItemId === newItem.menuItemId &&
          item.customizationJson === newItem.customizationJson,
      );

      if (existingItemIndex >= 0) {
        //if items already exists in order, update quantity
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        //adding new item to the array
        return [...currentItems, newItem];
      }
    });
  }, []);

  const removeOrderItem = useCallback(
    (menuItemId: number, customizationJson?: string) => {
      setOrderItems((currentItems) =>
        currentItems.filter(
          (item) =>
            !(
              item.menuItemId === menuItemId &&
              item.customizationJson === customizationJson
            ),
        ),
      );
    },
    [],
  );

  const updateOrderItemQuantity = useCallback(
    (
      menuItemId: number,
      customizationJson: string | undefined,
      quantity: number,
    ) => {
      if (quantity <= 0) {
        removeOrderItem(menuItemId, customizationJson);
        return;
      }

      setOrderItems((currentItems) =>
        currentItems.map((item) =>
          item.menuItemId === menuItemId &&
          item.customizationJson === customizationJson
            ? { ...item, quantity }
            : item,
        ),
      );
    },
    [removeOrderItem],
  );
  const clearOrder = useCallback(() => {
    setSelectedLocationId(null);
    setLocationName(null);
    setLocationAddress(null);
    setOrderItems([]);
  }, []);

  //Computations for order total
  //Will need to update
  const orderTotal = 0;
  const itemCount = orderItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const contextValue: OrderContextData = {
    selectedLocationId,
    orderItems,
    locationName,
    locationAddress,
    setLocation,
    addOrderItem,
    removeOrderItem,
    updateOrderItemQuantity,
    clearOrder,
    orderTotal,
    itemCount,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
