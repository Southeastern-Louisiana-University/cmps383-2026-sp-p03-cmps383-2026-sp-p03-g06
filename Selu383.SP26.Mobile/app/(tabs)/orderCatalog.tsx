import { OrderCatalogHeader } from "@/components/headers/orderCatalog-header";
import { ViewCart } from "@/components/modals/ViewCart";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useOrder } from "@/contexts/OrderContext";
import { getMenuItems } from "@/services/apis";
import { MenuItemDto } from "@/services/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function OrderCatalogScreen() {
  const [menuItems, setMenuItems] = useState<MenuItemDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  //state for location and orderContext
  const { selectedLocationId, locationName, addOrderItem, itemCount } =
    useOrder();

  //if no location selected, route to locationSelection
  useEffect(() => {
    if (selectedLocationId === null) {
      router.push("/(tabs)/order");
    }
  }, [selectedLocationId]);

  const handleAddToOrder = (menuItem: MenuItemDto) => {
    addOrderItem({
      menuItemId: menuItem.id,
      quantity: 1,
      customizationJson: undefined, //THIS IS WHERE CUSTOMIZATION GOES apparently..
    });
  };
  //hydrate catalog
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const items = await getMenuItems();
      setMenuItems(items.filter((item) => item.isAvailable)); // Only show available items
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    } finally {
      setLoading(false);
    }
  };
  //state for category filters in header
  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };
  //state for search filter in header
  const handleSearchChange = (searchText: string) => {
    setSearchQuery(searchText);
  };
  //filters the menu based on the filters in header, if no filters = all items show
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === null || item.categoryId === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  //card renderer for the items
  const renderMenuItem = ({ item }: { item: MenuItemDto }) => (
    <ThemedView style={styles.cardContainer}>
      <ThemedView style={styles.imageContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1637&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
          style={styles.itemImage}
        />
      </ThemedView>
      <ThemedText style={styles.catalogItemText}>
        {item.name || "Unknown Item"}
      </ThemedText>
      {/* <ThemedText style={styles.itemPrice}>${item.price.toFixed(2)}</ThemedText>
      {item.description && (
        <ThemedText style={styles.itemDescription}>
          {item.description}
        </ThemedText>
      )} */}
      <TouchableOpacity
        style={styles.customizeButton}
        onPress={() => handleAddToOrder(item)}
      >
        <ThemedText style={styles.customizeButtonText}>Add to Order</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0e5f00" />
        <ThemedText style={styles.loadingText}>
          Loading menu items...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <OrderCatalogHeader
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        locationName={locationName}
        itemCount={itemCount}
      />
      <FlatList
        data={filteredMenuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
      />

      {/* Floating View Cart Button */}
      {itemCount > 0 && (
        <TouchableOpacity
          style={styles.viewCartButton}
          onPress={() => setShowCart(true)}
        >
          <ThemedText style={styles.viewCartButtonText}>
            View Cart ({itemCount.toString()})
          </ThemedText>
        </TouchableOpacity>
      )}

      {/*cart modal controls*/}
      <Modal
        visible={showCart}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCart(false)}
      >
        <ThemedView style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setShowCart(false)}
            style={styles.closeButton}
          >
            <ThemedText style={styles.closeButtonText}>✕</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        <ViewCart />
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  row: {
    justifyContent: "flex-start",
  },
  cardContainer: {
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderColor: "#e9ecef",
    borderWidth: 1,
    width: 180,
    height: 240,
    margin: 5,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  itemImage: {
    width: 140,
    height: 120,
    borderRadius: 12,
  },
  catalogItemText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  itemPrice: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#0e5f00",
    marginBottom: 5,
  },
  itemDescription: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
    flex: 1,
  },
  customizeButton: {
    padding: 6,
    backgroundColor: "#7bf1a8",
    borderRadius: 16,
    alignItems: "center",
  },
  customizeButtonText: {
    color: "#434242",
    fontSize: 14,
    fontWeight: "bold",
  },
  viewCartButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#0e5f00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  viewCartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 15,
    paddingTop: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
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
});
