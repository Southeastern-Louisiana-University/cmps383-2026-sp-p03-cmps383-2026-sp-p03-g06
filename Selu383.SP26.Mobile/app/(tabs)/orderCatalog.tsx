import { OrderCatalogHeader } from "@/components/headers/orderCatalog-header";
import { ViewCart } from "@/components/modals/ViewCart";
import { ThemedText } from "@/components/themed-text";
import { getTheme } from "@/constants/theme";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
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
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrderCatalogScreen() {
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);
  const insets = useSafeAreaInsets();

  const [menuItems, setMenuItems] = useState<MenuItemDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  const { selectedLocationId, locationName, locationAddress, itemCount } =
    useOrder();

  useEffect(() => {
    if (selectedLocationId === null) {
      router.push("/(tabs)/order");
    }
  }, [selectedLocationId]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const items = await getMenuItems();
      setMenuItems(items.filter((item) => item.isAvailable));
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (menuItem: MenuItemDto) => {
    router.push({
      pathname: "/itemCustomization",
      params: { item: JSON.stringify(menuItem) },
    });
  };

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === null || item.categoryId === selectedCategory;

    const matchesSearch =
      searchQuery === "" ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const renderMenuItem = ({ item }: { item: MenuItemDto }) => (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        {
          backgroundColor: theme.background,
          borderColor: theme.background,
        },
      ]}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1637&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
          style={styles.itemImage}
        />
      </View>

      <ThemedText style={[styles.catalogItemText, { color: theme.text }]}>
        {item.name || "Unknown Item"}
      </ThemedText>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.loadingContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.accentDark} />
        <ThemedText style={[styles.loadingText, { color: theme.mutedText }]}>
          Loading menu items...
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <OrderCatalogHeader
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchQuery}
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

      {itemCount > 0 && (
        <TouchableOpacity
          style={[styles.viewCartButton, { backgroundColor: theme.accent }]}
          onPress={() => setShowCart(true)}
        >
          <ThemedText style={styles.viewCartButtonText}>
            View Cart ({itemCount.toString()})
          </ThemedText>
        </TouchableOpacity>
      )}

      <Modal
        visible={showCart}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCart(false)}
      >
        <View
          style={[
            styles.modalHeader,
            {
              backgroundColor: theme.background,
              borderBottomColor: theme.border,
              paddingTop: insets.top + 10,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => setShowCart(false)}
            style={[
              styles.closeButton,
              { backgroundColor: theme.elevatedCard },
            ]}
          >
            <AntDesign name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, backgroundColor: theme.background }}>
          <ViewCart
            onCheckout={() => {
              setShowCart(false);
              router.push("/checkout");
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
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
    borderRadius: 18,
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
  viewCartButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
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
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
