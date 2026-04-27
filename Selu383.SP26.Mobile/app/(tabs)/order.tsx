import SearchLocation from "@/components/modals/SearchLocation";
import { ThemedText } from "@/components/themed-text";
import { getTheme } from "@/constants/theme";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useOrder } from "@/contexts/OrderContext";
import { getLocations } from "@/services/apis";
import { Location } from "@/services/types";
import { isLocationOpen } from "@/utils/hoursUtils";
import Fontisto from "@expo/vector-icons/Fontisto";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const TEST_MODE_BYPASS_CLOSED = false;

export default function OrderScreen() {
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);
  const { setLocation } = useOrder();

  const [showModal, setShowModal] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const getInitialRegion = () => {
    if (locations.length === 0) {
      return {
        latitude: 30.5,
        longitude: -90.47,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      };
    }

    const avgLat =
      locations.reduce((sum, loc) => sum + (loc.latitude || 0), 0) /
      locations.length;

    const avgLng =
      locations.reduce((sum, loc) => sum + (loc.longitude || 0), 0) /
      locations.length;

    return {
      latitude: avgLat,
      longitude: avgLng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  };

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
        style={[
          styles.locationItem,
          {
            backgroundColor: isOpen ? theme.elevatedCard : theme.card,
            borderColor: theme.border,
          },
          !isOpen && styles.locationItemClosed,
        ]}
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
          <ThemedText style={[styles.locationName, { color: theme.text }]}>
            {location.name || "Unknown Location"}
          </ThemedText>

          <View
            style={[
              styles.statusBadge,
              isOpen ? styles.statusOpen : styles.statusClosed,
            ]}
          >
            <ThemedText
              style={[
                styles.statusText,
                isOpen ? styles.statusTextOpen : styles.statusTextClosed,
              ]}
            >
              {isOpen ? "Open" : "Closed"}
            </ThemedText>
          </View>
        </View>

        <ThemedText
          style={[styles.locationAddress, { color: theme.mutedText }]}
        >
          {location.address || "Address not available"}
        </ThemedText>

        <ThemedText
          style={[
            styles.locationAddress,
            { color: isOpen ? theme.mutedText : theme.softText },
          ]}
        >
          {location.hoursOfOperation || "Hours not available"}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView
        style={[styles.screen, { backgroundColor: theme.background }]}
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
            onPress={() => setShowModal(true)}
            style={[
              styles.headerButton,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <Fontisto name="search" size={22} color={theme.icon} />
          </TouchableOpacity>

          <ThemedText style={[styles.headerTitle, { color: theme.text }]}>
            Find a Location
          </ThemedText>

          <View style={styles.headerSpacer} />
        </View>

        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View
            style={[
              styles.mapContainer,
              {
                backgroundColor: theme.elevatedCard,
                borderColor: theme.border,
              },
            ]}
          >
            <MapView style={styles.map} initialRegion={getInitialRegion()}>
              {locations.map((location) => {
                if (!location.latitude || !location.longitude) return null;

                return (
                  <Marker
                    key={location.id}
                    coordinate={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}
                    title={location.name}
                    description={location.address || "Coffee location"}
                    onPress={() => {
                      const isOpen = isLocationOpen(location.hoursOfOperation);
                      const isSelectable = TEST_MODE_BYPASS_CLOSED || isOpen;

                      if (!isSelectable) return;

                      setLocation(
                        location.id,
                        location.name,
                        location.address || "Unknown Location",
                      );

                      router.push("/(tabs)/orderCatalog");
                    }}
                  />
                );
              })}
            </MapView>
          </View>

          <View
            style={[
              styles.selectionContainer,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <ScrollView
              style={styles.locationsList}
              showsVerticalScrollIndicator={false}
            >
              {loading ? (
                <ThemedText
                  style={[
                    styles.noLocationsMessage,
                    { color: theme.mutedText },
                  ]}
                >
                  Loading locations...
                </ThemedText>
              ) : locations.length === 0 ? (
                <ThemedText
                  style={[
                    styles.noLocationsMessage,
                    { color: theme.mutedText },
                  ]}
                >
                  No locations available
                </ThemedText>
              ) : (
                locations.map(renderLocationItem)
              )}
            </ScrollView>
          </View>
        </View>

        <SearchLocation
          visible={showModal}
          onClose={() => setShowModal(false)}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
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
  mapContainer: {
    height: 400,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectionContainer: {
    width: "100%",
    borderWidth: 1,
    flex: 1,
  },
  locationsList: {
    flex: 1,
  },
  locationItem: {
    borderRadius: 8,
    padding: 35,
    borderWidth: 1,
    marginHorizontal: 10,
    marginTop: 10,
  },
  locationItemClosed: {
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
    padding: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
