import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

export function HomeHeader() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning!  ";
    else if (hour < 17) return "Good Afternoon!  ";
    else return "Good Evening!  ";
  };

  const [search, setSearch] = useState("");
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <ThemedText type="subtitle">{getGreeting()}</ThemedText>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => console.log("Cart pressed")}
        >
          <Ionicons name="cart" size={20} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          placeholder="Search for your favorite coffee"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 60,
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: "#d2d1d1",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d6d6d6",
    borderRadius: 10,
    marginTop: 12,
    width: "100%",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
});
