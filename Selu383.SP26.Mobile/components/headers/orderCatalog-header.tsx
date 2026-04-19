import { getCategory } from "@/services/apis";
import { CategoryDto } from "@/services/types";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../themed-text";

interface OrderCatalogHeaderProps {
  onCategoryChange?: (categoryId: number | null) => void;
  onSearchChange?: (searchText: string) => void;
  locationName?: string | null;
  locationAddress?: string | null;
  itemCount?: number;
}

export function OrderCatalogHeader({
  onCategoryChange,
  onSearchChange,
  locationName,
  locationAddress,
  itemCount,
}: OrderCatalogHeaderProps) {
  const [filter, setFilter] = React.useState("");
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categories = await getCategory();
      setCategories(categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    onCategoryChange?.(categoryId);
  };

  const handleSearchChange = (text: string) => {
    setFilter(text);
    onSearchChange?.(text);
  };
  return (
    <View style={styles.container}>
      {locationName && (
        <View style={styles.locationBar}>
          <View style={styles.locationInfo}>
            <ThemedText style={styles.locationText}>{locationName}</ThemedText>
            {locationAddress && (
              <ThemedText style={styles.locationAddressText}>
                {locationAddress}
              </ThemedText>
            )}
          </View>
          {itemCount != null && itemCount > 0 && (
            <ThemedText style={styles.orderCountText}>
              {itemCount.toString()} item{itemCount === 1 ? "" : "s"} in order
            </ThemedText>
          )}
        </View>
      )}
      <View style={styles.actionContainer}>
        <TextInput
          placeholder="Search for menu items..."
          style={styles.searchInput}
          value={filter}
          onChangeText={handleSearchChange}
        />
      </View>
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContainer}
        >
          <TouchableOpacity
            style={[
              styles.searchFilterButton,
              selectedCategoryId === null && styles.searchFilterButtonActive,
            ]}
            onPress={() => handleCategoryPress(null)}
          >
            <ThemedText style={styles.filterText}>All</ThemedText>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.searchFilterButton,
                selectedCategoryId === category.id &&
                  styles.searchFilterButtonActive,
              ]}
              onPress={() => handleCategoryPress(category.id)}
            >
              <ThemedText style={styles.filterText}>
                {category.name || "Category"}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingTop: 60,
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  locationBar: {
    marginTop: 20,
    paddingHorizontal: 15,
    borderBottomColor: "#e9ecef",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
  },
  locationInfo: {
    flex: 1,
  },
  locationText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0e5f00",
  },
  locationAddressText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666",
    marginTop: 2,
  },
  orderCountText: {
    fontSize: 14,
    color: "#434242",
    fontWeight: "500",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 10,
  },
  searchInput: {
    width: "95%",
    marginTop: 12,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  filterContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryScrollContainer: {
    gap: 10,
  },
  searchFilterButton: {
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#7bf1a8",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
  },
  searchFilterButtonActive: {
    backgroundColor: "#5bb377",
  },
  filterText: {
    color: "#434242",
    fontSize: 12,
    fontWeight: "500",
  },
});
