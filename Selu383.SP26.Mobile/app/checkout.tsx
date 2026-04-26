import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getTheme } from "@/constants/theme";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useOrder } from "@/contexts/OrderContext";
import { useAuthentication } from "@/hooks/use-authentication";
import {
  createGuestOrder,
  createOrder,
  createPaymentSheet,
  getPickupTimes,
} from "@/services/apis";
import { PickupTimeDto } from "@/services/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useStripe } from "@stripe/stripe-react-native";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CheckoutProps {
  onSignIn?: () => void;
}

export default function Checkout({ onSignIn }: CheckoutProps) {
  const [pickupTimes, setPickupTimes] = useState<PickupTimeDto[]>([]);

  const [selectedPickupTime, setSelectedPickupTime] =
    useState<PickupTimeDto | null>(null);
  const { colorScheme } = useColorScheme();

  const theme = getTheme(colorScheme);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { isLoggedIn, loading } = useAuthentication();

  const {
    selectedLocationId,
    locationName,
    locationAddress,
    orderItems,
    clearOrder,
  } = useOrder();

  useEffect(() => {
    const loadPickupTimes = async () => {
      if (!selectedLocationId) return;

      try {
        const times = await getPickupTimes(selectedLocationId);
        setPickupTimes(times);

        if (times.length > 0) {
          setSelectedPickupTime(times[0]);
        }
      } catch (error) {
        console.log("Failed to load pickup times:", error);
      }
    };

    loadPickupTimes();
  }, [selectedLocationId]);
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

      const paymentSheetParams = await createPaymentSheet({
        locationId: selectedLocationId,
        orderItems,
        checkoutFirstName: firstName.trim(),
        checkoutLastName: lastName.trim(),
        checkoutEmail: email.trim(),
        checkoutPhoneNumber: phoneNumber.trim(),
      });

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

      if (initError) {
        Alert.alert("Payment Setup Failed", initError.message);
        return;
      }

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert("Payment Failed", paymentError.message);
        return;
      }

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
      <ThemedView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <ThemedView
          style={[styles.content, { backgroundColor: theme.background }]}
        >
          <ThemedText style={[styles.loadingText, { color: theme.mutedText }]}>
            Checking authentication...
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  const showChoiceScreen = !isLoggedIn && !isGuest;
  const checkoutTitle = isLoggedIn ? "Checkout" : "Checkout as Guest";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <ThemedView
          style={[styles.container, { backgroundColor: theme.background }]}
        >
          <View
            style={[
              styles.header,
              {
                backgroundColor: theme.background,
                borderBottomColor: theme.border,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.backButton,
                { backgroundColor: theme.inputBackground },
              ]}
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>

            <ThemedText
              style={[styles.headerTitle, { color: theme.text }]}
            ></ThemedText>

            <View style={styles.headerSpacer} />
          </View>
          <ScrollView
            style={[styles.scrollView, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {showChoiceScreen ? (
              <View>
                <ThemedText style={[styles.title, { color: theme.text }]}>
                  How would you like to continue?
                </ThemedText>

                <ThemedText
                  style={[styles.subtitle, { color: theme.mutedText }]}
                >
                  Sign in for a faster checkout or continue as a guest.
                </ThemedText>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleSignIn}
                >
                  <ThemedText style={styles.primaryButtonText}>
                    Sign In
                  </ThemedText>
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
                <ThemedText style={[styles.title, { color: theme.text }]}>
                  {checkoutTitle}
                </ThemedText>

                {locationName ? (
                  <ThemedView
                    style={[
                      styles.locationCard,
                      { backgroundColor: theme.card },
                    ]}
                  >
                    <ThemedText
                      style={[styles.locationLabel, { color: theme.mutedText }]}
                    >
                      Pickup Location
                    </ThemedText>
                    <ThemedText
                      style={[styles.locationName, { color: theme.text }]}
                    >
                      {locationName}
                    </ThemedText>
                    {locationAddress ? (
                      <ThemedText
                        style={[
                          styles.locationAddress,
                          { color: theme.mutedText },
                        ]}
                      >
                        {locationAddress}
                      </ThemedText>
                    ) : null}
                  </ThemedView>
                ) : null}

                <ThemedText
                  style={[styles.sectionTitle, { color: theme.text }]}
                >
                  Contact Information
                </ThemedText>

                <TextInput
                  placeholder="First Name"
                  placeholderTextColor={theme.mutedText}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                  value={firstName}
                  onChangeText={setFirstName}
                />

                <TextInput
                  placeholder="Last Name"
                  placeholderTextColor={theme.mutedText}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                  value={lastName}
                  onChangeText={setLastName}
                />

                <TextInput
                  placeholder="Email"
                  placeholderTextColor={theme.mutedText}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <TextInput
                  placeholder="Phone Number"
                  placeholderTextColor={theme.mutedText}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
                <ThemedText
                  style={[styles.sectionTitle, { color: theme.text }]}
                >
                  Pickup Time
                </ThemedText>

                <View style={styles.pickupTimesContainer}>
                  {pickupTimes.map((pickupTime) => {
                    const isSelected =
                      selectedPickupTime?.time === pickupTime.time;

                    return (
                      <TouchableOpacity
                        key={pickupTime.time}
                        style={[
                          styles.pickupTimeButton,
                          {
                            backgroundColor: isSelected
                              ? theme.accent
                              : theme.inputBackground,
                            borderColor: isSelected
                              ? theme.accentDark
                              : theme.border,
                          },
                        ]}
                        onPress={() => setSelectedPickupTime(pickupTime)}
                      >
                        <ThemedText
                          style={[
                            styles.pickupTimeText,
                            {
                              color: isSelected ? "#434242" : theme.text,
                            },
                          ]}
                        >
                          {pickupTime.label}
                        </ThemedText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <ThemedText
                  style={[styles.sectionTitle, { color: theme.text }]}
                >
                  Payment
                </ThemedText>

                <ThemedView
                  style={[styles.summaryCard, { backgroundColor: theme.card }]}
                >
                  <ThemedText
                    style={[styles.summaryText, { color: theme.text }]}
                  >
                    Payment will be collected securely after you tap Place
                    Order.
                  </ThemedText>
                  <ThemedText
                    style={[styles.summarySubtext, { color: theme.mutedText }]}
                  >
                    You will enter your card details in Stripe&apos;s payment
                    sheet.
                  </ThemedText>
                </ThemedView>

                <ThemedText
                  style={[styles.sectionTitle, { color: theme.text }]}
                >
                  Order Summary
                </ThemedText>

                <ThemedView
                  style={[styles.summaryCard, { backgroundColor: theme.card }]}
                >
                  <ThemedText
                    style={[styles.summaryText, { color: theme.text }]}
                  >
                    Items in Order: {orderItems.length}
                  </ThemedText>
                  <ThemedText
                    style={[styles.summarySubtext, { color: theme.mutedText }]}
                  >
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
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 24,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 12,
  },
  input: {
    height: 50,
    width: "100%",
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  primaryButton: {
    marginTop: 20,
    backgroundColor: "#7bf1a8",
    paddingVertical: 15,
    borderRadius: 8,
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
    color: "#7bf1a8",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
  },
  locationCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  locationLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 4,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
  },
  pickupTimesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },

  pickupTimeButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },

  pickupTimeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: 40,
  },
});
