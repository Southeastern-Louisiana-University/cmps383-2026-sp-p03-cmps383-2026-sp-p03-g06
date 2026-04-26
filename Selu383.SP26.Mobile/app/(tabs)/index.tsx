import { ThemedText } from "@/components/themed-text";
import { getTheme } from "@/constants/theme";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.topCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1637&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
          style={styles.image}
        />

        <ThemedText style={[styles.cardText, { color: theme.text }]}>
          Your day awaits
        </ThemedText>

        <ThemedText style={[styles.cardSubText, { color: theme.mutedText }]}>
          Explore various potential rewards and offers you can redeem with your
          points.
        </ThemedText>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.accent }]}
          onPress={() => router.push("/rewards")}
        >
          <ThemedText style={styles.buttonText}>Learn More</ThemedText>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.secondCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            style={styles.overlayImage}
          />

          <View style={styles.overlay}>
            <ThemedText style={styles.overlayText}>Quick Order</ThemedText>
            <ThemedText style={styles.overlaySubText}>
              Reorder your favorites
            </ThemedText>

            <TouchableOpacity
              style={[
                styles.overlayButton,
                { backgroundColor: theme.isDark ? theme.accent : "#2c2b2b" },
              ]}
              onPress={() => router.push("/order")}
            >
              <ThemedText
                style={[
                  styles.overlayButtonText,
                  { color: theme.isDark ? "#111111" : theme.accent },
                ]}
              >
                Order Now
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 2,
    paddingBottom: 20,
  },
  topCard: {
    margin: 10,
    paddingBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "left",
    marginTop: 15,
    paddingHorizontal: 20,
  },
  cardSubText: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "left",
    marginTop: 5,
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 15,
    marginRight: 20,
    borderRadius: 18,
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
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
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
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
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
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 18,
  },
  overlayButtonText: {
    fontWeight: "600",
    fontSize: 16,
  },
});
