import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
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
      <ThemedText type="subtitle">
        {getGreeting()} <Ionicons name="cafe" size={24} color="black" />
      </ThemedText>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          placeholder="Search for coffee..."
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
    paddingTop: 40,
    alignItems: "flex-start",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
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
