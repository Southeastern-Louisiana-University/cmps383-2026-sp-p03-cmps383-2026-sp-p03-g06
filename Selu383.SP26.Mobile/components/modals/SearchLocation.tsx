import { getLocationById } from "@/services/apis";
import { Location, SearchLocationProps } from "@/services/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
  const [locationId, setLocationId] = useState("");
  const [searchLocation, setSearchLocation] = useState<Location | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setErrorMessage("");

        if (!locationId.trim()) {
          setSearchLocation(null);
          return;
        }

        const id = Number(locationId);

        if (isNaN(id)) {
          setSearchLocation(null);
          setErrorMessage("Please enter a valid numeric id.");
          return;
        }

        const data = await getLocationById(id);
        setSearchLocation(data);
      } catch (error) {
        setSearchLocation(null);
        setErrorMessage("Location not found.");
        console.error("Error fetching search location:", error);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [locationId]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={onClose} style={styles.exitButton}>
            <MaterialIcons name="cancel" size={32} color="black" />
          </TouchableOpacity>
          {/*NEEDS TO BE SWITCHED TO SEARCH BY LOCATION NAME */}
          <TextInput
            placeholder="Enter location id"
            value={locationId}
            onChangeText={setLocationId}
            style={styles.searchInput}
            keyboardType="numeric"
          />
          {(errorMessage || searchLocation) && (
            <View style={styles.searchResultContainer}>
              <View style={styles.searchResults}>
                {errorMessage ? <ThemedText>{errorMessage}</ThemedText> : null}

                {searchLocation && (
                  <TouchableOpacity
                    onPress={() => {}}
                    style={styles.locationCard}
                  >
                    <ThemedText style={styles.locationName}>
                      {searchLocation.name || "Unknown Location"}
                    </ThemedText>
                    <ThemedText style={styles.locationAddress}>
                      {searchLocation.address || "Address not available"}
                    </ThemedText>
                  </TouchableOpacity>
                )}
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
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 50,
  },
  searchInput: {
    width: "90%",
    marginTop: 12,
    height: 40,
    borderColor: "#ccc",
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
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
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
    color: "#666",
    paddingLeft: 10,
  },
});

export default SearchLocation;
