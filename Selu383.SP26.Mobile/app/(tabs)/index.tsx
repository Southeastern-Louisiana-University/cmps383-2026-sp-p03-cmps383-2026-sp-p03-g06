import { ThemedView } from "@/components/themed-view";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.topCard}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1637&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
          style={styles.image}
        />
        <Text style={styles.cardText}>Your day awaits</Text>
        <Text style={styles.cardSubText}>
          Explore various potential rewards and offers you can redeem with your
          points.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/rewards")}
        >
          <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.secondCard}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            style={styles.overlayImage}
          />
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Quick Order</Text>
            <Text style={styles.overlaySubText}>Reorder your favorites</Text>
            <TouchableOpacity
              style={styles.overlayButton}
              onPress={() => router.push("/order")}
            >
              <Text style={styles.overlayButtonText}>Order Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
  },
  topCard: {
    margin: 10,
    paddingBottom: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D2D2D",
    textAlign: "left",
    marginTop: 15,
    paddingHorizontal: 20,
  },
  cardSubText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#666666",
    textAlign: "left",
    marginTop: 5,
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 15,
    marginRight: 20,
    borderRadius: 18,
    backgroundColor: "#7bf1a8",
    paddingVertical: 10,
    paddingHorizontal: 40,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#2c2b2b",
    fontWeight: "bold",
  },
  secondCard: {
    margin: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 250,
  },
  overlayImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.28)",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  overlayText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  overlaySubText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    marginBottom: 16,
  },
  overlayButton: {
    backgroundColor: "#2c2b2b",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 18,
  },
  overlayButtonText: {
    color: "#7bf1a8",
    fontWeight: "600",
    fontSize: 16,
  },
});
