import { getTheme } from "@/constants/theme";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useAuthentication } from "@/hooks/use-authentication";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";

export function AccountHeader() {
  const { isLoggedIn, loading } = useAuthentication();
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);

  if (!isLoggedIn || loading) {
    return null;
  }

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
        <ThemedText style={[styles.actionText, { color: theme.text }]}>
          My Account
        </ThemedText>
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
