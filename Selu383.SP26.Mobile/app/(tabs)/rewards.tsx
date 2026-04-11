import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet } from "react-native";

export default function RewardsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.rewardsContainer}>
        <ThemedText type="title">Lion Rewards</ThemedText>
        <ThemedView style={styles.rewardsCounterContainer}>
          <ThemedText style={styles.rewardsText}>Points</ThemedText>
          <ThemedText style={styles.rewardsTextPoints}>50/100</ThemedText>
          <ThemedView style={styles.rewardsBarContainer}>
            <LinearGradient
              style={styles.rewardsBarMeter}
              colors={["#7bf1a8", "#6fe39a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </ThemedView>
        </ThemedView>
        <ThemedText style={styles.rewardsMenuText}>Rewards Menu</ThemedText>
        <ThemedView style={styles.rewardsCardsContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1637&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            style={styles.image}
          />
          <ThemedText style={styles.rewardsCardText}>
            Enjoy 10% off your next order.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  rewardsContainer: {
    padding: 20,
    paddingTop: 80,
  },
  rewardsCounterContainer: {
    borderRadius: 10,
    marginTop: 20,
    height: 220,
    alignItems: "center",
    paddingTop: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  rewardsText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#434242",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  rewardsTextPoints: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold",
    color: "#434242",
  },
  rewardsTextContainer: {
    fontSize: 16,
  },
  rewardsBarContainer: {
    borderWidth: 1,
    borderColor: "#434242",
    backgroundColor: "#434242",
    borderRadius: 12,
    width: "80%",
    height: 20,
    marginTop: 40,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  rewardsBarMeter: {
    height: 14,
    width: "70%",
    borderRadius: 12,
  },
  rewardsMenuText: {
    fontSize: 20,
    marginTop: 30,
    marginBottom: 20,
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
    color: "#434242",
  },
  rewardsCardsContainer: {
    borderRadius: 10,
    height: 100,
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  rewardsCardText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 14,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
});
