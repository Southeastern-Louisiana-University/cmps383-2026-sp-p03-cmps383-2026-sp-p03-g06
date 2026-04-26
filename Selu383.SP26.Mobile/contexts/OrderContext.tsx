import { CreateOrderItemDto, RewardOfferingDto } from "@/services/types";
import React, { createContext, useCallback, useContext, useState } from "react";

interface OrderContextData {
  selectedLocationId: number | null;
  orderItems: CreateOrderItemDto[];
  locationName: string | null;
  locationAddress: string | null;

  selectedReward: RewardOfferingDto | null;
  rewardedMenuItemId: number | null;
  rewardedCustomizationJson: string | undefined;
  setRewardedCustomizationJson: (customizationJson: string | undefined) => void;

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

  setSelectedReward: (reward: RewardOfferingDto | null) => void;
  setRewardedMenuItemId: (menuItemId: number | null) => void;
  clearSelectedReward: () => void;

  clearOrder: () => void;

  orderTotal: number;
  itemCount: number;
}

const OrderContext = createContext<OrderContextData | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null,
  );
  const [rewardedCustomizationJson, setRewardedCustomizationJson] = useState<
    string | undefined
  >(undefined);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [locationAddress, setLocationAddress] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<CreateOrderItemDto[]>([]);

  const [selectedReward, setSelectedReward] =
    useState<RewardOfferingDto | null>(null);
  const [rewardedMenuItemId, setRewardedMenuItemId] = useState<number | null>(
    null,
  );

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
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      }

      return [...currentItems, newItem];
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

      setRewardedMenuItemId((currentRewardedMenuItemId) =>
        currentRewardedMenuItemId === menuItemId
          ? null
          : currentRewardedMenuItemId,
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

  const clearSelectedReward = useCallback(() => {
    setSelectedReward(null);
    setRewardedMenuItemId(null);
    setRewardedCustomizationJson(undefined);
  }, []);

  const clearOrder = useCallback(() => {
    setSelectedLocationId(null);
    setLocationName(null);
    setLocationAddress(null);
    setOrderItems([]);
    setSelectedReward(null);
    setRewardedMenuItemId(null);
    setRewardedCustomizationJson(undefined);
  }, []);

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
    selectedReward,
    rewardedMenuItemId,
    rewardedCustomizationJson,
    setLocation,
    addOrderItem,
    removeOrderItem,
    updateOrderItemQuantity,
    setSelectedReward,
    setRewardedMenuItemId,
    setRewardedCustomizationJson,
    clearSelectedReward,
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
