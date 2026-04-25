import { OrderCatalogHeader } from "@/components/headers/orderCatalog-header";
import { ViewCart } from "@/components/modals/ViewCart";
import { Checkout } from "@/components/modals/checkout";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useOrder } from "@/contexts/OrderContext";
import { getMenuItems } from "@/services/apis";
import { MenuItemDto } from "@/services/types";
import AntDesign from "@expo/vector-icons/AntDesign";
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
  const [showCheckout, setShowCheckout] = useState(false);
  const { selectedLocationId, locationName, locationAddress, itemCount } =
    useOrder();

  useEffect(() => {
    if (selectedLocationId === null) {
      router.push("/(tabs)/order");
    }
  }, [selectedLocationId]);

  const handleItemPress = (menuItem: MenuItemDto) => {
    router.push({
      pathname: "/itemCustomization",
      params: { item: JSON.stringify(menuItem) },
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
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.8}
    >
      <ThemedView style={styles.imageContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1637&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
          style={styles.itemImage}
        />
      </ThemedView>
      <ThemedText
        style={styles.catalogItemText}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {item.name || "Unknown Item"}
      </ThemedText>
      {/* <ThemedText style={styles.itemPrice}>${item.price.toFixed(2)}</ThemedText>
      {item.description && (
        <ThemedText style={styles.itemDescription}>
          {item.description}
        </ThemedText>
      )} */}
    </TouchableOpacity>
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
        locationAddress={locationAddress}
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
            <ThemedText style={styles.closeButtonText}>
              <AntDesign name="close" size={24} color="black" />
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
        <ViewCart
          onCheckout={() => {
            setShowCart(false);
            setShowCheckout(true);
          }}
        />
      </Modal>

      <Modal
        visible={showCheckout}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCheckout(false)}
      >
        <ThemedView style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setShowCheckout(false)}
            style={styles.closeButton}
          >
            <ThemedText style={styles.closeButtonText}>
              <AntDesign name="close" size={24} color="black" />
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <Checkout />
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
    paddingHorizontal: 10,
  },
  cardContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 18,
    borderColor: "#e9ecef",
    borderWidth: 1,
    width: 160,
    minHeight: 150,
    margin: 8,
    overflow: "hidden",
    justifyContent: "flex-start",
  },
  imageContainer: {
    alignItems: "center",
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  itemImage: {
    width: 120,
    height: 140,
    borderRadius: 60,
    resizeMode: "cover",
  },
  catalogItemText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 8,
    lineHeight: 18,
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
  viewCartButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#7bf1a8",
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
    color: "#434242",
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
