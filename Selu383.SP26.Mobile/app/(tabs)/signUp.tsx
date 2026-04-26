import { ThemedText } from "@/components/themed-text";
import { getTheme } from "@/constants/theme";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { signUpUser } from "@/services/apis";
import { RegisterDto } from "@/services/types";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);

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
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <ThemedText style={[styles.signInHeader, { color: theme.text }]}>
          Start claiming rewards now!
        </ThemedText>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.inputBorder,
              color: theme.text,
            },
          ]}
          placeholder="Username"
          placeholderTextColor={theme.mutedText}
          value={userName}
          onChangeText={setUserName}
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.inputBorder,
              color: theme.text,
            },
          ]}
          placeholder="Password"
          placeholderTextColor={theme.mutedText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[
            styles.signInButton,
            { backgroundColor: theme.accent },
            isLoading && styles.buttonDisabled,
          ]}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <ThemedText style={styles.signInButtonText}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </ThemedText>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <ThemedText style={[styles.signUpText, { color: theme.softText }]}>
            Already have an account?
          </ThemedText>

          <TouchableOpacity onPress={() => router.push("/login")}>
            <ThemedText style={[styles.signUpLink, { color: theme.accent }]}>
              Sign In
            </ThemedText>
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: "#434242", // kept your original styling
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
  },
  signUpLink: {
    fontWeight: "bold",
  },
});
