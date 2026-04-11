import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

export function OrderCatalogHeader() {
  const [filter, setFilter] = React.useState("");
  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <TextInput
          placeholder="Search for menu items..."
          style={styles.searchInput}
          value={filter}
          onChangeText={setFilter}
        />
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.searchFilterButton} onPress={() => {}}>
          <ThemedText style={styles.filterText}>Filter</ThemedText>
        </TouchableOpacity>
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
  actionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingTop: 20,
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
  searchFilterButton: {
    width: 72,
    height: 28,
    borderRadius: 16,
    backgroundColor: "#0e5f00",
    justifyContent: "center",
    alignItems: "center",
  },
  filterText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
