import { getTheme } from "@/constants/theme";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import Fontisto from "@expo/vector-icons/Fontisto";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import SearchLocation from "../modals/SearchLocation";

export function LocationSelectHeader() {
  const [showModal, setShowModal] = useState(false);
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Fontisto name="search" size={24} color={theme.icon} />
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
