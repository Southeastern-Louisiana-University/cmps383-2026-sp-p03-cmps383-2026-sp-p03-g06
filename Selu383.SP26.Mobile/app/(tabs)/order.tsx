import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getLocations } from "@/services/apis";
import { Location } from "@/services/types";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView from "react-native-maps";

export default function OrderScreen() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

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

  const renderLocationItem = (location: Location) => (
    <TouchableOpacity
      key={location.id}
      style={styles.locationItem}
      onPress={() => {
        router.push("/(tabs)/orderCatalog");
      }}
    >
      <ThemedText style={styles.locationName}>{location.name}</ThemedText>
      <ThemedText style={styles.locationAddress}>{location.address}</ThemedText>
      <ThemedText style={styles.locationAddress}>
        HOURS OF OPERATION GO HERE
      </ThemedText>
      {/* NEED TO ADD HOURS OF OPERATION, IF CLOSED OR NOT */}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <MapView style={styles.mapContainer} />

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
    padding: 45,
    borderColor: "#e9ecef",
    borderWidth: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  locationAddress: {
    fontSize: 14,
    color: "#555",
  },
  noLocationsMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    padding: 20,
  },
});
