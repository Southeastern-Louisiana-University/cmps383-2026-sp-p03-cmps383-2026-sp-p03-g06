import { getTheme } from "@/constants/theme";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useAuthentication } from "@/hooks/use-authentication";
import { logoutUser } from "@/services/apis";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

export function HomeHeader() {
  const { isLoggedIn } = useAuthentication();
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Ready to Caffeinate?  ";
    if (hour < 17) return "Need a Coffee Break?  ";
    return "Evening Treat Awaits!  ";
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        onPress: async () => {
          try {
            await logoutUser();
          } catch (error) {
            console.log("Logout error:", error);
          }
        },
      },
    ]);
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
      <ThemedText
        type="title"
        style={[styles.greetingMessage, { color: theme.text }]}
      >
        {getGreeting()}
      </ThemedText>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => router.push("/order")}
        >
          <FontAwesome5 name="shopping-cart" size={20} color={theme.icon} />
          <ThemedText style={[styles.actionText, { color: theme.softText }]}>
            View Order
          </ThemedText>
        </TouchableOpacity>

        {isLoggedIn ? (
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color={theme.icon} />
            <ThemedText style={[styles.actionText, { color: theme.softText }]}>
              Sign Out
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push("/account")}
          >
            <Ionicons name="person" size={20} color={theme.icon} />
            <ThemedText style={[styles.actionText, { color: theme.softText }]}>
              Sign In
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 80,
    alignItems: "stretch",
    borderBottomWidth: 1,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  orderButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "500",
  },
  greetingMessage: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Funnel Sans, sans-serif",
  },
});
