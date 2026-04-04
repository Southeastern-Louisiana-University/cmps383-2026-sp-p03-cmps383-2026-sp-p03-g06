import Fontisto from "@expo/vector-icons/Fontisto";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import SearchLocation from "../modals/SearchLocation";

export function LocationSelectHeader() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <TouchableOpacity
          onPress={() => {
            setShowModal(true);
          }}
        >
          {/* PUT MODAL HERE FOR SEARCHING LOCATIONS */}
          <Fontisto name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <SearchLocation visible={showModal} onClose={() => setShowModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingTop: 60,
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
});
