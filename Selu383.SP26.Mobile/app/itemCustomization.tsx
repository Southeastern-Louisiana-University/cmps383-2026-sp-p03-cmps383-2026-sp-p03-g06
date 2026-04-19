import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useOrder } from "@/contexts/OrderContext";
import { MenuItemDto } from "@/services/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

export default function ItemCustomizationScreen() {
  const params = useLocalSearchParams();
  const { addOrderItem } = useOrder();

  const menuItem: MenuItemDto = JSON.parse(params.item as string);

  const [quantity, setQuantity] = useState(1);

  const calculatePrice = () => {
    return menuItem.price * quantity;
  };

  const handleAddToOrder = () => {
    addOrderItem({
      menuItemId: menuItem.id,
      quantity: quantity,
      customizationJson: undefined,
    });

    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <ThemedView style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ThemedText style={styles.backButtonText}>
                <AntDesign name="arrow-left" size={24} color="black" />
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.itemHeader}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1637&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
              style={styles.itemImage}
            />
            <ThemedText style={styles.itemName}>{menuItem.name}</ThemedText>
            <ThemedText style={styles.itemDescription}>
              {menuItem.description || "Delicious coffee beverage"}
            </ThemedText>
            <ThemedText style={styles.itemPrice}>
              ${menuItem.price.toFixed(2)}
            </ThemedText>
          </ThemedView>

          {/* Quantity Selection */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Quantity</ThemedText>
            <ThemedView style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                <ThemedText style={styles.quantityButtonText}>-</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.quantityText}>
                {quantity.toString()}
              </ThemedText>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <ThemedText style={styles.quantityButtonText}>+</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ScrollView>

        {/* Floating Add to Cart Button */}
        <TouchableOpacity
          style={styles.floatingAddButton}
          onPress={handleAddToOrder}
        >
          <ThemedText style={styles.addButtonText}>
            Add to Cart - ${calculatePrice().toFixed(2)}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for floating button
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#666",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
  },
  itemHeader: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  itemImage: {
    width: 200,
    height: 150,
    borderRadius: 15,
    resizeMode: "cover",
    marginBottom: 15,
  },
  itemName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: "#434242",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7bf1a8",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#434242",
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "600",
    minWidth: 30,
    textAlign: "center",
  },
  floatingAddButton: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "#7bf1a8",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  addButtonText: {
    color: "#434242",
    fontSize: 18,
    fontWeight: "bold",
  },
});
