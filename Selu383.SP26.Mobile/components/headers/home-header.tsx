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
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Ready to Caffeinate?  ";
    else if (hour < 17) return "Need a Coffee Break?  ";
    else return "Evening Treat Awaits!  ";
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        onPress: async () => {
          try {
            await logoutUser();
            // The useAuthentication hook will automatically refresh the state
          } catch (error) {
            console.log("Logout error:", error);
          }
        },
      },
    ]);
  };

  const handleSignIn = () => {
    router.push("/account");
  };
  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.greetingMessage}>
        {getGreeting()}
      </ThemedText>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => router.push("/order")}
        >
          <FontAwesome5 name="shopping-cart" size={20} color="#333" />
          <ThemedText style={styles.actionText}>View Order</ThemedText>
        </TouchableOpacity>

        {isLoggedIn ? (
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color="#333" />
            <ThemedText style={[styles.actionText, styles.signOutText]}>
              Sign Out
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Ionicons name="person" size={20} color="#333" />
            <ThemedText style={styles.actionText}>Sign In</ThemedText>
          </TouchableOpacity>
        )}
      </View>
      {/* <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          placeholder="Search for your favorite coffee"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 80,
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
  signOutText: {
    color: "#333",
  },
  actionText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  greetingMessage: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "Funnel Sans, sans-serif",
  },
});
