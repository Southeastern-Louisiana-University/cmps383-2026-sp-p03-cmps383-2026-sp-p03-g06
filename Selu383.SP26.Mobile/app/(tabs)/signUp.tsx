import { signUpUser } from "@/services/apis";
import { RegisterDto } from "@/services/types";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    const hasMinLength = password.length >= 6;

    return {
      isValid: hasUpperCase && hasSpecialChar && hasMinLength,
      errors: [
        ...(!hasMinLength ? ["At least 6 characters"] : []),
        ...(!hasUpperCase ? ["One uppercase letter (A-Z)"] : []),
        ...(!hasSpecialChar ? ["One special character (!@#$%^&*)"] : []),
      ],
    };
  };

  const handleSignUp = async () => {
    if (!userName.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Validate password requirements
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      Alert.alert(
        "Password Requirements",
        "Password must have:\n• " + passwordValidation.errors.join("\n• "),
      );
      return;
    }

    setIsLoading(true);
    try {
      const registerData: RegisterDto = {
        userName: userName.trim(),
        password: password,
      };

      await signUpUser(registerData);

      Alert.alert(
        "Success!",
        "Account created successfully! You can now login.",
        [
          {
            text: "Go to Login",
            onPress: () => router.push("/login"),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.signInHeader}>Start claiming rewards now!</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={userName}
          onChangeText={setUserName}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={[styles.signInButton, isLoading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text style={styles.signInButtonText}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => {
              router.push("/login");
            }}
          >
            <Text style={styles.signUpLink}>Sign In</Text>
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
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  signInButtonText: {
    color: "#434242",
    fontWeight: "500",
    fontSize: 16,
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
