import { useOrder } from "@/contexts/OrderContext";
import { getMenuItems } from "@/services/apis";
import { MenuItemDto } from "@/services/types";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

interface CartItemWithDetails {
  menuItemId: number;
  quantity: number;
  customizationJson?: string;
  menuItem?: MenuItemDto;
}

export function ViewCart() {
  const {
    orderItems,
    selectedLocationId,
    locationName,
    updateOrderItemQuantity,
    removeOrderItem,
    clearOrder,
    itemCount,
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

  const handleQuantityChange = (menuItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(menuItemId);
    } else {
      updateOrderItemQuantity(menuItemId, newQuantity);
    }
  };

  const handleRemoveItem = (menuItemId: number) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeOrderItem(menuItemId),
        },
      ],
    );
  };

  const calculateItemTotal = (item: CartItemWithDetails): number => {
    return (item.menuItem?.price || 0) * item.quantity;
  };

  const calculateOrderTotal = (): number => {
    return cartItemsWithDetails.reduce((total, item) => {
      return total + calculateItemTotal(item);
    }, 0);
  };
  //PUT CHECKOUT IMPLEMETATION HERE, PLACEHOLDER
  const handleCheckout = () => {
    Alert.alert("Checkout", "Checkout flow will be implemented next!");
  };

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clearOrder },
      ],
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.loadingText}>Loading cart...</ThemedText>
      </ThemedView>
    );
  }

  if (itemCount === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.emptyCart}>
          <ThemedText style={styles.emptyCartTitle}>
            Your cart is empty
          </ThemedText>
          <ThemedText style={styles.emptyCartText}>
            Add some delicious items from our menu!
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Your Order</ThemedText>
        {locationName ? (
          <ThemedText style={styles.locationText}>{locationName}</ThemedText>
        ) : null}
        <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
          <ThemedText style={styles.clearButtonText}>Clear Cart</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/*Cart Items*/}
      <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
        {cartItemsWithDetails.map((item, index) => (
          <ThemedView
            key={`item-${item.menuItemId.toString()}-${index.toString()}`}
            style={styles.cartItem}
          >
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1637&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
              style={styles.itemImage}
            />

            <ThemedView style={styles.itemDetails}>
              <ThemedText style={styles.itemName}>
                {item.menuItem?.name || "Unknown Item"}
              </ThemedText>

              {item.menuItem?.description ? (
                <ThemedText style={styles.itemDescription}>
                  {item.menuItem.description}
                </ThemedText>
              ) : null}

              {item.customizationJson ? (
                <ThemedText style={styles.customization}>Customized</ThemedText>
              ) : null}

              <ThemedText style={styles.itemPrice}>
                ${(item.menuItem?.price || 0).toFixed(2)} each
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() =>
                  handleQuantityChange(item.menuItemId, item.quantity - 1)
                }
              >
                <ThemedText style={styles.quantityButtonText}>-</ThemedText>
              </TouchableOpacity>

              <ThemedText style={styles.quantity}>
                {item.quantity.toString()}
              </ThemedText>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() =>
                  handleQuantityChange(item.menuItemId, item.quantity + 1)
                }
              >
                <ThemedText style={styles.quantityButtonText}>+</ThemedText>
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.itemTotalContainer}>
              <ThemedText style={styles.itemTotal}>
                ${(calculateItemTotal(item) || 0).toFixed(2)}
              </ThemedText>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.menuItemId)}
              >
                <ThemedText style={styles.removeButtonText}>Remove</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        ))}
      </ScrollView>

      {/*Order Summary*/}
      <ThemedView style={styles.summary}>
        <ThemedView style={styles.summaryRow}>
          <ThemedText style={styles.summaryLabel}>
            Items ({itemCount.toString()})
          </ThemedText>
          <ThemedText style={styles.summaryValue}>
            ${(calculateOrderTotal() || 0).toFixed(2)}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.summaryRow}>
          <ThemedText style={styles.summaryLabel}>Tax</ThemedText>
          <ThemedText style={styles.summaryValue}>
            ${((calculateOrderTotal() || 0) * 0.08).toFixed(2)}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.divider} />

        <ThemedView style={styles.summaryRow}>
          <ThemedText style={styles.totalLabel}>Total</ThemedText>
          <ThemedText style={styles.totalValue}>
            ${((calculateOrderTotal() || 0) * 1.08).toFixed(2)}
          </ThemedText>
        </ThemedView>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <ThemedText style={styles.checkoutButtonText}>
            Proceed to Checkout
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: "#0e5f00",
    fontWeight: "600",
  },
  clearButton: {
    alignSelf: "flex-end",
    padding: 5,
  },
  clearButtonText: {
    color: "#ff6b6b",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
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
    color: "#666",
  },
  emptyCartText: {
    fontSize: 16,
    textAlign: "center",
    color: "#999",
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
  itemDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 3,
  },
  customization: {
    fontSize: 11,
    color: "#0e5f00",
    fontStyle: "italic",
    marginBottom: 3,
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
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
    backgroundColor: "#7bf1a8",
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
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0e5f00",
    marginBottom: 5,
  },
  removeButton: {
    padding: 3,
  },
  removeButtonText: {
    fontSize: 12,
    color: "#ff6b6b",
    fontWeight: "600",
  },
  summary: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0e5f00",
  },
  checkoutButton: {
    backgroundColor: "#7bf1a8",
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
