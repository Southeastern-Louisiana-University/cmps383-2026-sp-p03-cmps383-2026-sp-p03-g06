import { getTheme } from "@/constants/theme";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useOrder } from "@/contexts/OrderContext";
import { getLocations } from "@/services/apis";
import { Location, SearchLocationProps } from "@/services/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../themed-text";

const SearchLocation: React.FC<SearchLocationProps> = ({
  visible,
  onClose,
}) => {
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);
  const { setLocation } = useOrder();

  const [searchText, setSearchText] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setErrorMessage("Unable to load locations.");
      }
    };

    if (visible) {
      fetchLocations();
    }
  }, [visible]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage("");

      if (!searchText.trim()) {
        setFilteredLocations([]);
        return;
      }

      const results = locations.filter((location) =>
        location.name?.toLowerCase().includes(searchText.toLowerCase()),
      );

      setFilteredLocations(results);

      if (results.length === 0) {
        setErrorMessage("No locations found.");
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchText, locations]);

  const handleSelectLocation = (location: Location) => {
    setLocation(
      location.id,
      location.name,
      location.address || "Unknown Location",
    );

    setSearchText("");
    setFilteredLocations([]);
    onClose();

    router.push("/(tabs)/orderCatalog");
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalView,
            {
              backgroundColor: theme.background,
            },
          ]}
        >
          <TouchableOpacity onPress={onClose} style={styles.exitButton}>
            <MaterialIcons name="cancel" size={32} color={theme.text} />
          </TouchableOpacity>

          <TextInput
            placeholder="Search location name"
            placeholderTextColor={theme.mutedText}
            value={searchText}
            onChangeText={setSearchText}
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.inputBorder,
                color: theme.text,
              },
            ]}
            autoCapitalize="words"
          />

          {(errorMessage || filteredLocations.length > 0) && (
            <View style={styles.searchResultContainer}>
              <View style={styles.searchResults}>
                {errorMessage ? (
                  <ThemedText
                    style={[styles.errorText, { color: theme.mutedText }]}
                  >
                    {errorMessage}
                  </ThemedText>
                ) : null}

                {filteredLocations.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    onPress={() => handleSelectLocation(location)}
                    style={[
                      styles.locationCard,
                      {
                        backgroundColor: theme.elevatedCard,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[styles.locationName, { color: theme.text }]}
                    >
                      {location.name || "Unknown Location"}
                    </ThemedText>

                    <ThemedText
                      style={[
                        styles.locationAddress,
                        { color: theme.mutedText },
                      ]}
                    >
                      {location.address || "Address not available"}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  searchInput: {
    width: "90%",
    marginTop: 12,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  exitButton: {
    alignSelf: "flex-end",
    paddingRight: 40,
  },
  searchResults: {
    marginTop: 20,
    width: "100%",
  },
  searchResultContainer: {
    width: "100%",
    alignItems: "center",
  },
  locationCard: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    width: "100%",
  },
  locationName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    paddingLeft: 10,
  },
  locationAddress: {
    fontSize: 14,
    paddingLeft: 10,
  },
  errorText: {
    textAlign: "center",
    marginBottom: 10,
  },
});

export default SearchLocation;
