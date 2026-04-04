import { StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";

export function AccountHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <ThemedText style={styles.actionText}>My Account</ThemedText>
      </View>
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
  actionText: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 10,
  },
});
