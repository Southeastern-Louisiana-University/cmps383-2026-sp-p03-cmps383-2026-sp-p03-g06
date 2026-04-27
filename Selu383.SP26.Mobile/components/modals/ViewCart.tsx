import { getTheme } from "@/constants/theme";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useOrder } from "@/contexts/OrderContext";
import { getMenuItems } from "@/services/apis";
import { MenuItemDto } from "@/services/types";
import { calculateCartItemTotal } from "@/utils/pricing";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../themed-text";

interface CartItemWithDetails {
  menuItemId: number;
  quantity: number;
  customizationJson?: string;
  menuItem?: MenuItemDto;
}

interface ViewCartProps {
  onCheckout: () => void;
}

export function ViewCart({ onCheckout }: ViewCartProps) {
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);
  const FALLBACK_MENU_IMAGE =
    "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1637&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const {
    orderItems,
    locationName,
    locationAddress,
    updateOrderItemQuantity,
    removeOrderItem,
    itemCount,
    selectedReward,
    rewardedMenuItemId,
    rewardedCustomizationJson,
  } = useOrder();

  const [menuItems, setMenuItems] = useState<MenuItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<
    CartItemWithDetails[]
  >([]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (menuItems.length > 0) {
      updateCartItemsWithDetails();
    }
  }, [orderItems, menuItems]);

  const fetchMenuItems = async () => {
    try {
      const items = await getMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItemsWithDetails = () => {
    const itemsWithDetails = orderItems.map((orderItem) => {
      const menuItem = menuItems.find(
        (item) => item.id === orderItem.menuItemId,
      );

      return {
        ...orderItem,
        menuItem,
      };
    });

    setCartItemsWithDetails(itemsWithDetails);
  };

  const isRewardedCartItem = (item: CartItemWithDetails): boolean => {
    return (
      !!selectedReward &&
      rewardedMenuItemId === item.menuItemId &&
      rewardedCustomizationJson === item.customizationJson
    );
  };

  const hasRealCustomization = (customizationJson?: string): boolean => {
    if (!customizationJson) return false;

    try {
      const parsed = JSON.parse(customizationJson);

      const defaultValues: Record<string, unknown> = {
        drinkSize: "small",
        milkType: "whole",
        shotCount: 1,
        temperature: "hot",
      };

      return Object.entries(parsed).some(([key, value]) => {
        if (value === null || value === undefined || value === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;

        if (defaultValues[key] !== undefined && defaultValues[key] === value) {
          return false;
        }

        return true;
      });
    } catch {
      return false;
    }
  };

  const handleQuantityChange = (
    menuItemId: number,
    customizationJson: string | undefined,
    newQuantity: number,
  ) => {
    if (newQuantity <= 0) {
      handleRemoveItem(menuItemId, customizationJson);
    } else {
      updateOrderItemQuantity(menuItemId, customizationJson, newQuantity);
    }
  };

  const handleRemoveItem = (
    menuItemId: number,
    customizationJson: string | undefined,
  ) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeOrderItem(menuItemId, customizationJson),
        },
      ],
    );
  };

  const calculateItemTotal = (item: CartItemWithDetails): number => {
    const normalTotal = calculateCartItemTotal({
      basePrice: item.menuItem?.price || 0,
      quantity: item.quantity,
      customizationJson: item.customizationJson,
    });

    if (!isRewardedCartItem(item)) {
      return normalTotal;
    }

    const singleItemPrice = calculateCartItemTotal({
      basePrice: item.menuItem?.price || 0,
      quantity: 1,
      customizationJson: item.customizationJson,
    });

    return Math.max(normalTotal - singleItemPrice, 0);
  };

  const calculateOrderTotal = (): number => {
    return cartItemsWithDetails.reduce((total, item) => {
      return total + calculateItemTotal(item);
    }, 0);
  };

  const handleCheckout = () => {
    onCheckout();
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ThemedText style={[styles.loadingText, { color: theme.mutedText }]}>
          Loading cart...
        </ThemedText>
      </View>
    );
  }
  const subtotal = calculateOrderTotal() || 0;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + tax;

  if (itemCount === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.emptyCart}>
          <ThemedText style={[styles.emptyCartTitle, { color: theme.text }]}>
            Your cart is empty
          </ThemedText>

          <ThemedText
            style={[styles.emptyCartText, { color: theme.mutedText }]}
          >
            Add some delicious items from our menu!
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <ThemedText style={[styles.headerTitle, { color: theme.text }]}>
          Your Order
        </ThemedText>

        {locationName ? (
          <ThemedText
            style={[styles.locationText, { color: theme.accentDark }]}
          >
            {locationName}
          </ThemedText>
        ) : null}

        {locationAddress ? (
          <ThemedText
            style={[styles.locationAddress, { color: theme.accentDark }]}
          >
            {locationAddress}
          </ThemedText>
        ) : null}
      </View>

      <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
        {cartItemsWithDetails.map((item, index) => {
          const isRewardedItem = isRewardedCartItem(item);

          return (
            <View
              key={`item-${item.menuItemId.toString()}-${index.toString()}`}
              style={[
                styles.cartItem,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.background,
                },
              ]}
            >
              <Image
                source={{
                  uri: item.menuItem?.imageUrl || FALLBACK_MENU_IMAGE,
                }}
                style={styles.itemImage}
              />

              <View style={styles.itemDetails}>
                <ThemedText style={[styles.itemName, { color: theme.text }]}>
                  {item.menuItem?.name || "Unknown Item"}
                </ThemedText>

                {isRewardedItem ? (
                  <ThemedText
                    style={[styles.rewardText, { color: theme.accentDark }]}
                  >
                    Free Reward
                  </ThemedText>
                ) : null}

                {hasRealCustomization(item.customizationJson) ? (
                  <ThemedText
                    style={[styles.customization, { color: theme.accentDark }]}
                  >
                    Customized
                  </ThemedText>
                ) : null}
              </View>

              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    { backgroundColor: theme.accent },
                  ]}
                  onPress={() =>
                    handleQuantityChange(
                      item.menuItemId,
                      item.customizationJson,
                      item.quantity - 1,
                    )
                  }
                >
                  <ThemedText style={styles.quantityButtonText}>-</ThemedText>
                </TouchableOpacity>

                <ThemedText style={[styles.quantity, { color: theme.text }]}>
                  {item.quantity.toString()}
                </ThemedText>

                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    { backgroundColor: theme.accent },
                  ]}
                  onPress={() =>
                    handleQuantityChange(
                      item.menuItemId,
                      item.customizationJson,
                      item.quantity + 1,
                    )
                  }
                >
                  <ThemedText style={styles.quantityButtonText}>+</ThemedText>
                </TouchableOpacity>
              </View>

              <View style={styles.itemTotalContainer}>
                <ThemedText
                  style={[
                    styles.itemTotal,
                    {
                      color: isRewardedItem
                        ? theme.accentDark
                        : theme.accentDark,
                    },
                  ]}
                >
                  {isRewardedItem
                    ? item.quantity > 1
                      ? `${calculateItemTotal(item).toFixed(2)} \n 1 Free`
                      : "Free"
                    : `$${calculateItemTotal(item).toFixed(2)}`}
                </ThemedText>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() =>
                    handleRemoveItem(item.menuItemId, item.customizationJson)
                  }
                >
                  <ThemedText style={styles.removeButtonText}>
                    Remove
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View
        style={[
          styles.summary,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
          },
        ]}
      >
        <View style={styles.summaryRow}>
          <ThemedText style={[styles.summaryLabel, { color: theme.mutedText }]}>
            Items ({itemCount.toString()})
          </ThemedText>

          <ThemedText style={[styles.summaryValue, { color: theme.text }]}>
            ${(calculateOrderTotal() || 0).toFixed(2)}
          </ThemedText>
        </View>

        <View style={styles.summaryRow}>
          <ThemedText style={[styles.summaryLabel, { color: theme.mutedText }]}>
            Tax
          </ThemedText>

          <ThemedText style={[styles.summaryValue, { color: theme.text }]}>
            ${tax.toFixed(2)}
          </ThemedText>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.summaryRow}>
          <ThemedText style={[styles.totalLabel, { color: theme.text }]}>
            Total
          </ThemedText>

          <ThemedText style={[styles.totalValue, { color: theme.accentDark }]}>
            ${total.toFixed(2)}
          </ThemedText>
        </View>

        <TouchableOpacity
          style={[styles.checkoutButton, { backgroundColor: theme.accent }]}
          onPress={handleCheckout}
        >
          <ThemedText style={styles.checkoutButtonText}>
            Proceed to Checkout
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "600",
  },
  locationAddress: {
    fontSize: 14,
    fontWeight: "600",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyCartText: {
    fontSize: 16,
    textAlign: "center",
  },
  cartList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  cartItem: {
    flexDirection: "row",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 3,
  },
  customization: {
    fontSize: 11,
    fontStyle: "italic",
    marginBottom: 3,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 3,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#434242",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 15,
    minWidth: 20,
    textAlign: "center",
  },
  itemTotalContainer: {
    alignItems: "flex-end",
    minWidth: 80,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "right",
  },
  removeButton: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  removeButtonText: {
    fontSize: 12,
    color: "#ff6b6b",
    fontWeight: "600",
    textAlign: "right",
  },
  summary: {
    padding: 20,
    paddingBottom: 45,
    borderTopWidth: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  checkoutButton: {
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#434242",
    fontSize: 18,
    fontWeight: "bold",
  },
});
