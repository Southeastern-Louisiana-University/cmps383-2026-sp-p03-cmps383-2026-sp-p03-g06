import { useAuthentication } from "@/hooks/use-authentication";
import { logoutUser } from "@/services/apis";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import LoginScreen from "./login";

export default function AccountScreen() {
  const { isLoggedIn, loading, checkAuth } = useAuthentication();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await logoutUser();
            //refreshes the auth state after logout
            await checkAuth();
          } catch (error) {
            console.log("Logout error:", error);
            await checkAuth();
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text>Loading...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Show login screen if not authenticated
  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  // Show authenticated user content
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
    borderColor: "#000",
    borderWidth: 1,
  },
  logoutButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
