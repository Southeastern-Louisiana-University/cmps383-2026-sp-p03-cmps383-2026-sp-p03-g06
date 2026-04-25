import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useOrder } from "@/contexts/OrderContext";
import { getLocations } from "@/services/apis";
import { Location } from "@/services/types";
import { isLocationOpen } from "@/utils/hoursUtils";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Set to true to bypass closed location check for testing
const TEST_MODE_BYPASS_CLOSED = true;

export default function OrderScreen() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const { setLocation } = useOrder();

  useEffect(() => {
    loadLocations();
  }, []);

  async function loadLocations() {
    try {
      const data = await getLocations();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  }

  const renderLocationItem = (location: Location) => {
    const isOpen = isLocationOpen(location.hoursOfOperation);
    const isSelectable = TEST_MODE_BYPASS_CLOSED || isOpen;

    return (
      <TouchableOpacity
        key={location.id}
        style={[styles.locationItem, !isOpen && styles.locationItemClosed]}
        onPress={() => {
          if (!isSelectable) return;
          setLocation(
            location.id,
            location.name,
            location.address || "Unknown Location",
          );
          router.push("/(tabs)/orderCatalog");
        }}
        disabled={!isSelectable}
      >
        <View style={styles.locationHeader}>
          <ThemedText style={styles.locationName}>
            {location.name || "Unknown Location"}
          </ThemedText>
          <View
            style={[
              styles.statusBadge,
              isOpen ? styles.statusOpen : styles.statusClosed,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isOpen ? styles.statusTextOpen : styles.statusTextClosed,
              ]}
            >
              {isOpen ? "Open" : "Closed"}
            </Text>
          </View>
        </View>
        <ThemedText style={styles.locationAddress}>
          {location.address || "Address not available"}
        </ThemedText>
        <ThemedText
          style={[styles.locationAddress, !isOpen && styles.closedText]}
        >
          {location.hoursOfOperation || "Hours not available"}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* <MapView style={styles.mapContainer} /> */}
      <View style={styles.mapContainer}>
        <ThemedText>Map temporarily disabled</ThemedText>
      </View>
      <View style={styles.selectionContainer}>
        <ScrollView
          style={styles.locationsList}
          showsVerticalScrollIndicator={false}
        >
          {locations.length === 0 ? (
            <ThemedText style={styles.noLocationsMessage}>
              No locations available
            </ThemedText>
          ) : (
            locations.map(renderLocationItem)
          )}
        </ScrollView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  mapContainer: {
    height: 400,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  selectionContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderColor: "#494848",
    borderWidth: 1,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  locationsList: {
    flex: 1,
  },
  locationItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 35,
    borderColor: "#e9ecef",
    borderWidth: 1,
  },
  locationItemClosed: {
    backgroundColor: "#f0f0f0",
    opacity: 0.7,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  locationAddress: {
    fontSize: 14,
    color: "#555",
  },
  closedText: {
    color: "#999",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusOpen: {
    backgroundColor: "#d4edda",
  },
  statusClosed: {
    backgroundColor: "#f8d7da",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusTextOpen: {
    color: "#155724",
  },
  statusTextClosed: {
    color: "#721c24",
  },
  noLocationsMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    padding: 20,
  },
});
