import { ThemedText } from "@/components/themed-text";
import { getTheme } from "@/constants/theme";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useAuthentication } from "@/hooks/use-authentication";
import { getMyProfile, logoutUser, updateMyProfile } from "@/services/apis";
import { ProfileDto } from "@/services/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import LoginScreen from "./login";

type EditableField = "email" | "phone" | "address" | null;

export default function AccountScreen() {
  const { isLoggedIn, loading, checkAuth } = useAuthentication();
  const [showProfileInfo, setShowProfileInfo] = useState(true);
  const [editingField, setEditingField] = useState<EditableField>(null);

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const { colorSchemePreference, setColorSchemePreference, colorScheme } =
    useColorScheme();

  const theme = getTheme(colorScheme);

  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      loadProfile();
    }
  }, [isLoggedIn]);

  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      const data = await getMyProfile();

      setProfile(data);
      setEmail(data.email || "");
      setPhoneNumber(data.phoneNumber || "");
    } catch (error) {
      console.log("Failed to load profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdateField = async (field: EditableField) => {
    if (!field) return;

    try {
      setSavingProfile(true);

      const updatedProfile = await updateMyProfile({
        email: field === "email" ? email.trim() : profile?.email || "",
        phoneNumber:
          field === "phone" ? phoneNumber.trim() : profile?.phoneNumber || "",
        preferredLocationId: profile?.preferredLocationId ?? null,
      });

      setProfile(updatedProfile);
      setEmail(updatedProfile.email || "");
      setPhoneNumber(updatedProfile.phoneNumber || "");
      setEditingField(null);

      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      console.log("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelFieldEdit = () => {
    setEditingField(null);
    setEmail(profile?.email || "");
    setPhoneNumber(profile?.phoneNumber || "");
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await logoutUser();
            await checkAuth();
          } catch (error) {
            console.log("Logout error:", error);
            await checkAuth();
          }
        },
      },
    ]);
  };

  const cycleColorScheme = () => {
    if (colorSchemePreference === "system") {
      setColorSchemePreference("dark");
    } else if (colorSchemePreference === "dark") {
      setColorSchemePreference("light");
    } else {
      setColorSchemePreference("system");
    }
  };

  const getColorSchemeLabel = () => {
    switch (colorSchemePreference) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
      default:
        return "System";
    }
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView
          style={[styles.container, { backgroundColor: theme.background }]}
        >
          <ThemedText style={[styles.loadingText, { color: theme.text }]}>
            Loading...
          </ThemedText>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

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
            <View style={styles.headerSpacer} />

            <ThemedText style={[styles.headerTitle, { color: theme.text }]}>
              Account
            </ThemedText>

            <View style={styles.headerSpacer} />
          </View>
          <ScrollView
            style={{ flex: 1, backgroundColor: theme.background }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.section,
                {
                  backgroundColor: theme.elevatedCard,
                  borderColor: theme.border,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => setShowProfileInfo(!showProfileInfo)}
                activeOpacity={0.8}
              >
                <ThemedText
                  style={[styles.sectionTitle, { color: theme.text }]}
                >
                  My Profile
                </ThemedText>

                <MaterialIcons
                  name={
                    showProfileInfo
                      ? "keyboard-arrow-up"
                      : "keyboard-arrow-down"
                  }
                  size={28}
                  color={theme.text}
                />
              </TouchableOpacity>

              {showProfileInfo &&
                (profileLoading ? (
                  <ThemedText
                    style={[styles.profileText, { color: theme.mutedText }]}
                  >
                    Loading profile...
                  </ThemedText>
                ) : (
                  <>
                    <View
                      style={[
                        styles.profileRow,
                        {
                          backgroundColor: theme.background,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <ThemedText
                        style={[styles.profileLabel, { color: theme.softText }]}
                      >
                        Username
                      </ThemedText>
                      <ThemedText
                        style={[styles.profileValue, { color: theme.text }]}
                      >
                        {profile?.userName || "Not available"}
                      </ThemedText>
                    </View>

                    <View
                      style={[
                        styles.profileRow,
                        {
                          backgroundColor: theme.background,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <View style={styles.rowHeader}>
                        <ThemedText
                          style={[
                            styles.profileLabel,
                            { color: theme.softText },
                          ]}
                        >
                          Email
                        </ThemedText>

                        {editingField !== "email" && (
                          <TouchableOpacity
                            onPress={() => setEditingField("email")}
                          >
                            <MaterialIcons
                              name="edit"
                              size={18}
                              color={theme.text}
                            />
                          </TouchableOpacity>
                        )}
                      </View>

                      {editingField === "email" ? (
                        <>
                          <TextInput
                            style={[
                              styles.profileInput,
                              {
                                backgroundColor: theme.inputBackground,
                                borderColor: theme.inputBorder,
                                color: theme.text,
                              },
                            ]}
                            placeholder="Email"
                            placeholderTextColor={theme.mutedText}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                          />

                          <View style={styles.editButtonRow}>
                            <TouchableOpacity
                              style={[
                                styles.smallButton,
                                { backgroundColor: theme.accent },
                              ]}
                              onPress={() => handleUpdateField("email")}
                              disabled={savingProfile}
                            >
                              <ThemedText style={styles.accountButtonText}>
                                {savingProfile ? "Saving..." : "Save"}
                              </ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[
                                styles.smallButton,
                                {
                                  backgroundColor: theme.card,
                                  borderColor: theme.border,
                                  borderWidth: 1,
                                },
                              ]}
                              onPress={handleCancelFieldEdit}
                              disabled={savingProfile}
                            >
                              <ThemedText
                                style={[
                                  styles.logoutButtonText,
                                  { color: theme.text },
                                ]}
                              >
                                Cancel
                              </ThemedText>
                            </TouchableOpacity>
                          </View>
                        </>
                      ) : (
                        <ThemedText
                          style={[styles.profileValue, { color: theme.text }]}
                        >
                          {profile?.email || "Not available"}
                        </ThemedText>
                      )}
                    </View>

                    <View
                      style={[
                        styles.profileRow,
                        {
                          backgroundColor: theme.background,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <View style={styles.rowHeader}>
                        <ThemedText
                          style={[
                            styles.profileLabel,
                            { color: theme.softText },
                          ]}
                        >
                          Phone
                        </ThemedText>

                        {editingField !== "phone" && (
                          <TouchableOpacity
                            onPress={() => setEditingField("phone")}
                          >
                            <MaterialIcons
                              name="edit"
                              size={18}
                              color={theme.text}
                            />
                          </TouchableOpacity>
                        )}
                      </View>

                      {editingField === "phone" ? (
                        <>
                          <TextInput
                            style={[
                              styles.profileInput,
                              {
                                backgroundColor: theme.inputBackground,
                                borderColor: theme.inputBorder,
                                color: theme.text,
                              },
                            ]}
                            placeholder="Phone"
                            placeholderTextColor={theme.mutedText}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                          />

                          <View style={styles.editButtonRow}>
                            <TouchableOpacity
                              style={[
                                styles.smallButton,
                                { backgroundColor: theme.accent },
                              ]}
                              onPress={() => handleUpdateField("phone")}
                              disabled={savingProfile}
                            >
                              <ThemedText style={styles.accountButtonText}>
                                {savingProfile ? "Saving..." : "Save"}
                              </ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[
                                styles.smallButton,
                                {
                                  backgroundColor: theme.card,
                                  borderColor: theme.border,
                                  borderWidth: 1,
                                },
                              ]}
                              onPress={handleCancelFieldEdit}
                              disabled={savingProfile}
                            >
                              <ThemedText
                                style={[
                                  styles.logoutButtonText,
                                  { color: theme.text },
                                ]}
                              >
                                Cancel
                              </ThemedText>
                            </TouchableOpacity>
                          </View>
                        </>
                      ) : (
                        <ThemedText
                          style={[styles.profileValue, { color: theme.text }]}
                        >
                          {profile?.phoneNumber || "Not available"}
                        </ThemedText>
                      )}
                    </View>

                    <View
                      style={[
                        styles.profileRow,
                        {
                          backgroundColor: theme.background,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <ThemedText
                        style={[styles.profileLabel, { color: theme.softText }]}
                      >
                        Orders Placed
                      </ThemedText>
                      <ThemedText
                        style={[styles.profileValue, { color: theme.text }]}
                      >
                        {profile?.orderCount ?? 0}
                      </ThemedText>
                    </View>
                  </>
                ))}
            </View>

            <TouchableOpacity
              style={[styles.accountButton, { backgroundColor: theme.accent }]}
              onPress={() => router.push("/previousOrders")}
            >
              <ThemedText style={styles.accountButtonText}>
                View Previous Orders
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.accountButton, { backgroundColor: theme.accent }]}
              onPress={cycleColorScheme}
            >
              <ThemedText style={styles.accountButtonTextLight}>
                Mode: {getColorSchemeLabel()} | Current: {colorScheme}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.logoutButton,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.card,
                },
              ]}
              onPress={handleLogout}
            >
              <ThemedText
                style={[styles.logoutButtonText, { color: theme.text }]}
              >
                Logout
              </ThemedText>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  loadingText: {
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileText: {
    fontSize: 15,
    marginBottom: 8,
  },
  profileRow: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  profileLabel: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "500",
  },
  profileValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  profileInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 15,
    marginTop: 4,
  },
  editButtonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  smallButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  accountButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  accountButtonText: {
    color: "#434242",
    fontSize: 16,
    fontWeight: "600",
  },
  accountButtonTextLight: {
    color: "#434242",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  headerSpacer: {
    width: 40,
  },
});
