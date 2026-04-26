import { getTheme } from "@/constants/theme";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
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
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);

  const [filter, setFilter] = useState("");
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categories = await getCategory();
      setCategories(categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
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
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          borderBottomColor: theme.border,
        },
      ]}
    >
      {locationName && (
        <View style={styles.locationBar}>
          <View style={styles.locationInfo}>
            <ThemedText style={[styles.locationText, { color: theme.text }]}>
              {locationName}
            </ThemedText>

            {locationAddress && (
              <ThemedText
                style={[styles.locationAddressText, { color: theme.mutedText }]}
              >
                {locationAddress}
              </ThemedText>
            )}
          </View>

          {itemCount != null && itemCount > 0 && (
            <ThemedText style={[styles.orderCountText, { color: theme.text }]}>
              {itemCount} item{itemCount === 1 ? "" : "s"} in order
            </ThemedText>
          )}
        </View>
      )}

      <View style={styles.actionContainer}>
        <TextInput
          placeholder="Search for menu items..."
          placeholderTextColor={theme.mutedText}
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.inputBorder,
              color: theme.text,
            },
          ]}
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
              { backgroundColor: theme.accent },
              selectedCategoryId === null && {
                backgroundColor: theme.accentDark,
              },
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
                { backgroundColor: theme.accent },
                selectedCategoryId === category.id && {
                  backgroundColor: theme.accentDark,
                },
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
  },
  locationBar: {
    marginTop: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationInfo: {
    flex: 1,
  },
  locationText: {
    fontSize: 18,
    fontWeight: "600",
  },
  locationAddressText: {
    fontSize: 14,
    marginTop: 2,
  },
  orderCountText: {
    fontSize: 14,
    fontWeight: "500",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  searchInput: {
    width: "95%",
    marginTop: 12,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  filterContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  categoryScrollContainer: {
    gap: 10,
  },
  searchFilterButton: {
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
  },
  filterText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "500",
  },
});
