import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useOrder } from "@/contexts/OrderContext";
import { useAuthentication } from "@/hooks/use-authentication";
import { createGuestOrder, createOrder } from "@/services/apis";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface CheckoutProps {
  onSignIn?: () => void;
}

export function Checkout({ onSignIn }: CheckoutProps) {
  const { isLoggedIn, loading } = useAuthentication();
  const {
    selectedLocationId,
    locationName,
    locationAddress,
    orderItems,
    clearOrder,
  } = useOrder();

  const [isGuest, setIsGuest] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
      return;
    }

    router.push("/login");
  };

  const handlePlaceOrder = async () => {
    if (!selectedLocationId) {
      Alert.alert(
        "Missing Location",
        "Please select a location before checkout.",
      );
      return;
    }

    if (orderItems.length === 0) {
      Alert.alert("Empty Order", "Your cart is empty.");
      return;
    }

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phoneNumber.trim()
    ) {
      Alert.alert(
        "Missing Information",
        "Please complete all checkout fields.",
      );
      return;
    }

    if (!cardNumber.trim() || !expiry.trim() || !cvc.trim()) {
      Alert.alert(
        "Missing Payment Info",
        "Please complete the payment fields.",
      );
      return;
    }

    try {
      setSubmitting(true);

      if (isLoggedIn) {
        await createOrder(selectedLocationId, orderItems, {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
        });
      } else {
        await createGuestOrder({
          checkoutFirstName: firstName.trim(),
          checkoutLastName: lastName.trim(),
          checkoutEmail: email.trim(),
          checkoutPhoneNumber: phoneNumber.trim(),
          locationId: selectedLocationId,
          orderItems,
        });
      }

      clearOrder();
      Alert.alert("Success", "Your order has been placed.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong placing your order.";
      Alert.alert("Order Failed", message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText style={styles.loadingText}>
            Checking authentication...
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  const showChoiceScreen = !isLoggedIn && !isGuest;
  const checkoutTitle = isLoggedIn ? "Checkout" : "Checkout as Guest";

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {showChoiceScreen ? (
          <View>
            <ThemedText style={styles.title}>
              How would you like to continue?
            </ThemedText>

            <ThemedText style={styles.subtitle}>
              Sign in for a faster checkout or continue as a guest.
            </ThemedText>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSignIn}
            >
              <ThemedText style={styles.primaryButtonText}>Sign In</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setIsGuest(true)}
            >
              <ThemedText style={styles.secondaryButtonText}>
                Checkout as Guest
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <ThemedText style={styles.title}>{checkoutTitle}</ThemedText>

            {locationName ? (
              <ThemedView style={styles.locationCard}>
                <ThemedText style={styles.locationLabel}>
                  Pickup Location
                </ThemedText>
                <ThemedText style={styles.locationName}>
                  {locationName}
                </ThemedText>
                {locationAddress ? (
                  <ThemedText style={styles.locationAddress}>
                    {locationAddress}
                  </ThemedText>
                ) : null}
              </ThemedView>
            ) : null}

            <ThemedText style={styles.sectionTitle}>
              Contact Information
            </ThemedText>

            <TextInput
              placeholder="First Name"
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              placeholder="Last Name"
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Phone Number"
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            <ThemedText style={styles.sectionTitle}>Payment</ThemedText>

            <TextInput
              placeholder="Card Number"
              style={styles.input}
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="number-pad"
            />
            <View style={styles.row}>
              <TextInput
                placeholder="MM/YY"
                style={[styles.input, styles.halfInput]}
                value={expiry}
                onChangeText={setExpiry}
              />
              <TextInput
                placeholder="CVC"
                style={[styles.input, styles.halfInput]}
                value={cvc}
                onChangeText={setCvc}
                keyboardType="number-pad"
              />
            </View>

            <ThemedText style={styles.sectionTitle}>Order Summary</ThemedText>

            <ThemedView style={styles.summaryCard}>
              <ThemedText style={styles.summaryText}>
                Items in Order: {orderItems.length}
              </ThemedText>
              <ThemedText style={styles.summarySubtext}>
                Final totals are based on the backend order calculation.
              </ThemedText>
            </ThemedView>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                submitting && styles.disabledButton,
              ]}
              onPress={handlePlaceOrder}
              disabled={submitting}
            >
              <ThemedText style={styles.primaryButtonText}>
                {submitting ? "Placing Order..." : "Place Order"}
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 24,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 12,
    color: "#111",
  },
  input: {
    height: 50,
    width: "100%",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f8f9fa",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  primaryButton: {
    marginTop: 20,
    backgroundColor: "#7bf1a8",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#434242",
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
  },
  locationCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    marginBottom: 8,
  },
  locationLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    color: "#666",
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    marginTop: 4,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: "#666",
  },
});
