import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { getCurrentUser, loginUser } from "../../services/apis";

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps = {}) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkAuth = async () => {
    try {
      const userData = await getCurrentUser();
      if (userData) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const handleLogin = async () => {
    if (!userName || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser({
        userName,
        password,
      });

      // Login successful
      Alert.alert("Success", "Login successful!", [
        {
          text: "OK",
          onPress: () => {
            if (onLoginSuccess) {
              // If callback provided, call it (used when embedded in AccountScreen)
              onLoginSuccess();
            } else {
              // Otherwise navigate to main app area
              router.push("/(tabs)");
            }
          },
        },
      ]);
    } catch (error) {
      // Login failed
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.signInHeader}>Claim your rewards now!</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={userName}
          onChangeText={setUserName}
          autoCapitalize="none"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.signInButton, loading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signInButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => {
              router.push("/signUp");
            }}
            disabled={loading}
          >
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  input: {
    height: 40,
    width: "100%",
    margin: 12,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  signInButton: {
    width: "90%",
    marginTop: 20,
    backgroundColor: "#7bf1a8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  signInButtonText: {
    color: "#434242",
    fontWeight: "500",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  signInHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  signUpText: {
    fontSize: 14,
    color: "#434242",
  },
  signUpLink: {
    color: "#7bf1a8",
    fontWeight: "bold",
  },
});
