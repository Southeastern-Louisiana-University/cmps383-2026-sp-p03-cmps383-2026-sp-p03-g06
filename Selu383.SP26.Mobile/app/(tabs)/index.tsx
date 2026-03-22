import { ThemedView } from "@/components/themed-view";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
          onPress={() => console.log("Button pressed")}
        >
          <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    textAlign: "left",
    marginTop: 15,
    paddingHorizontal: 20,
  },
  cardSubText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666666",
    textAlign: "left",
    marginTop: 5,
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 15,
    marginRight: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0e5f00",
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#0e5f00",
  },
});
