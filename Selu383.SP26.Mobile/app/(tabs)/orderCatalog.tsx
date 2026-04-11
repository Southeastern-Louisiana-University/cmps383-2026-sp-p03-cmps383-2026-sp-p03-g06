import { OrderCatalogHeader } from "@/components/headers/orderCatalog-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getMenuItems } from "@/services/apis";
import { MenuItemDto } from "@/services/types";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function OrderCatalogScreen() {
  const [menuItems, setMenuItems] = useState<MenuItemDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchChange = (searchText: string) => {
    setSearchQuery(searchText);
  };

  // Filter menu items based on selected category and search query
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === null || item.categoryId === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderMenuItem = ({ item }: { item: MenuItemDto }) => (
    <ThemedView style={styles.cardContainer}>
      <ThemedView style={styles.imageContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={styles.itemImage}
        />
      </ThemedView>
      <ThemedText style={styles.catalogItemText}>{item.name}</ThemedText>
      <TouchableOpacity style={styles.customizeButton} onPress={() => {}}>
        <ThemedText style={styles.customizeButtonText}>Customize</ThemedText>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
    paddingTop: 20,
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
    marginBottom: 5,
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
});
