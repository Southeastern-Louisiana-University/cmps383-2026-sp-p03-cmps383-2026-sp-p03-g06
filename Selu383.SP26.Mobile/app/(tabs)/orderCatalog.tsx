import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

export default function OrderCatalogScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.cardContainer}>
        <ThemedView style={styles.imageContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/150" }}
            style={styles.itemImage}
          />
        </ThemedView>
        <ThemedText style={styles.catalogItemText}>Menu Item Name</ThemedText>
        <TouchableOpacity style={styles.customizeButton} onPress={() => {}}>
          <ThemedText style={styles.customizeButtonText}>Customize</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  cardContainer: {
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderColor: "#e9ecef",
    borderWidth: 1,
    width: 180,
    height: 250,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  itemImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  catalogItemText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  customizeButton: {
    padding: 5,
    marginTop: 6,
    backgroundColor: "#0e5f00",
    borderRadius: 16,
    alignItems: "center",
  },
  customizeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
