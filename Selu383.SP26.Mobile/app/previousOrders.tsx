import { ThemedText } from "@/components/themed-text";
import { getTheme } from "@/constants/theme";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { getMyOrders } from "@/services/apis";
import { OrderDto } from "@/services/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function PreviousOrdersScreen() {
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      console.log("MY ORDERS RESPONSE:", data);

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Failed to load previous orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date unavailable";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaProvider>
        <SafeAreaView
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

            <ThemedText style={[styles.headerTitle, { color: theme.text }]}>
              Previous Orders
            </ThemedText>

            <View style={styles.headerSpacer} />
          </View>

          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={theme.accentDark} />
              <ThemedText
                style={[styles.loadingText, { color: theme.mutedText }]}
              >
                Loading previous orders...
              </ThemedText>
            </View>
          ) : orders.length === 0 ? (
            <View style={styles.centerContainer}>
              <MaterialIcons
                name="receipt-long"
                size={52}
                color={theme.mutedText}
              />

              <ThemedText style={[styles.emptyTitle, { color: theme.text }]}>
                No previous orders
              </ThemedText>

              <ThemedText
                style={[styles.emptyText, { color: theme.mutedText }]}
              >
                Once you place an order, it will show up here.
              </ThemedText>

              <TouchableOpacity
                style={[styles.orderButton, { backgroundColor: theme.accent }]}
                onPress={() => router.push("/(tabs)/order")}
              >
                <ThemedText style={styles.orderButtonText}>
                  Start an Order
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              style={{ flex: 1, backgroundColor: theme.background }}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {orders.map((order, index) => (
                <View
                  key={order.id?.toString() || index.toString()}
                  style={[
                    styles.orderCard,
                    {
                      backgroundColor: theme.elevatedCard,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={styles.orderHeader}>
                    <View>
                      <ThemedText
                        style={[styles.orderTitle, { color: theme.text }]}
                      >
                        Order #{order.id ?? index + 1}
                      </ThemedText>

                      <ThemedText
                        style={[styles.orderDate, { color: theme.mutedText }]}
                      >
                        {formatDate(order.createdAt)} •{" "}
                        {formatTime(order.createdAt)}
                      </ThemedText>
                    </View>

                    {order.status ? (
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: theme.isDark
                              ? "#1f3d2b"
                              : "#d4edda",
                          },
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.statusText,
                            {
                              color: theme.isDark
                                ? theme.accent
                                : theme.darkGreen,
                            },
                          ]}
                        >
                          {order.status}
                        </ThemedText>
                      </View>
                    ) : null}
                  </View>

                  <View
                    style={[styles.divider, { backgroundColor: theme.border }]}
                  />

                  <View style={styles.orderRow}>
                    <ThemedText
                      style={[styles.orderLabel, { color: theme.softText }]}
                    >
                      Location ID
                    </ThemedText>
                    <ThemedText
                      style={[styles.orderValue, { color: theme.text }]}
                    >
                      {order.locationId ?? "N/A"}
                    </ThemedText>
                  </View>

                  {order.totalPrice != null ? (
                    <View style={styles.orderRow}>
                      <ThemedText
                        style={[styles.orderLabel, { color: theme.softText }]}
                      >
                        Total
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.orderValue,
                          {
                            color: theme.isDark
                              ? theme.accent
                              : theme.darkGreen,
                          },
                        ]}
                      >
                        ${order.totalPrice.toFixed(2)}
                      </ThemedText>
                    </View>
                  ) : null}
                </View>
              ))}
            </ScrollView>
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  orderButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  orderButtonText: {
    color: "#434242",
    fontSize: 16,
    fontWeight: "600",
  },
  orderCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  orderTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  orderValue: {
    fontSize: 14,
    fontWeight: "600",
  },
});
