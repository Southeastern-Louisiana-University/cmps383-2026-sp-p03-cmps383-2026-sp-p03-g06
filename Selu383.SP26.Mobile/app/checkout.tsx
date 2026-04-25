import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useOrder } from "@/contexts/OrderContext";
import { useAuthentication } from "@/hooks/use-authentication";
import {
  createGuestOrder,
  createOrder,
  createPaymentSheet,
} from "@/services/apis";
import { useStripe } from "@stripe/stripe-react-native";
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

export default function Checkout({ onSignIn }: CheckoutProps) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
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

    try {
      setSubmitting(true);
      console.log("1. Starting checkout");

      const paymentSheetParams = await createPaymentSheet({
        locationId: selectedLocationId,
        orderItems,
        checkoutFirstName: firstName.trim(),
        checkoutLastName: lastName.trim(),
        checkoutEmail: email.trim(),
        checkoutPhoneNumber: phoneNumber.trim(),
      });

      console.log("2. Payment sheet params received", paymentSheetParams);

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Lion Rewards Cafe",
        customerId: paymentSheetParams.customer,
        customerEphemeralKeySecret: paymentSheetParams.ephemeralKey,
        paymentIntentClientSecret: paymentSheetParams.paymentIntent,
        defaultBillingDetails: {
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim(),
          phone: phoneNumber.trim(),
        },
        allowsDelayedPaymentMethods: false,
      });

      console.log("3. initPaymentSheet finished", initError);

      if (initError) {
        Alert.alert("Payment Setup Failed", initError.message);
        return;
      }

      console.log("4. About to present payment sheet");

      const { error: paymentError } = await presentPaymentSheet();

      console.log("5. presentPaymentSheet finished", paymentError);

      if (paymentError) {
        Alert.alert("Payment Failed", paymentError.message);
        return;
      }

      console.log("5. Payment succeeded, creating order");

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
      Alert.alert("Success", "Payment complete and order placed.");
    } catch (error) {
      console.error("Checkout error", error);
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong during checkout.";
      Alert.alert("Checkout Failed", message);
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

            <ThemedView style={styles.summaryCard}>
              <ThemedText style={styles.summaryText}>
                Payment will be collected securely after you tap Place Order.
              </ThemedText>
              <ThemedText style={styles.summarySubtext}>
                You will enter your card details in Stripe&apos;s payment sheet.
              </ThemedText>
            </ThemedView>

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
                {submitting ? "Processing..." : "Place Order"}
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
