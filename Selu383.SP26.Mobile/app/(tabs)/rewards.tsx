import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useAuthentication } from "@/hooks/use-authentication";
import { getMyRewards, getRewardOfferings } from "@/services/apis";
import { RewardOfferingDto, UserRewardsDto } from "@/services/types";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet } from "react-native";

export default function RewardsScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const theme = {
    background: isDark ? "#121212" : "#ffffff",
    card: isDark ? "#1e1e1e" : "#ffffff",
    elevatedCard: isDark ? "#242424" : "#ffffff",
    text: isDark ? "#f5f5f5" : "#434242",
    mutedText: isDark ? "#b5b5b5" : "#666666",
    border: isDark ? "#333333" : "#e5e5e5",
    barBackground: isDark ? "#333333" : "#434242",
    accent: "#7bf1a8",
    darkGreen: "#395a46",
  };

  const [rewardOfferings, setRewardOfferings] = useState<RewardOfferingDto[]>(
    [],
  );
  const [userRewards, setUserRewards] = useState<UserRewardsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, loading: authLoading } = useAuthentication();

  useFocusEffect(
    useCallback(() => {
      if (authLoading) {
        return;
      }

      if (!isLoggedIn) {
        router.replace("/login");
        return;
      }

      const fetchData = async () => {
        try {
          setLoading(true);

          const [offerings, myRewards] = await Promise.all([
            getRewardOfferings(),
            getMyRewards(),
          ]);

          if (Array.isArray(offerings)) {
            setRewardOfferings(offerings);
          } else if (offerings) {
            setRewardOfferings([offerings]);
          } else {
            setRewardOfferings([]);
          }

          setUserRewards(myRewards);
        } catch (error) {
          console.error("Failed to fetch rewards data:", error);
          setRewardOfferings([]);
          setUserRewards(null);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [isLoggedIn, authLoading]),
  );

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {authLoading || !isLoggedIn ? (
        <ThemedView
          style={[
            styles.centerContainer,
            { backgroundColor: theme.background },
          ]}
        >
          <ThemedText style={{ color: theme.text }}>
            Redirecting to login...
          </ThemedText>
        </ThemedView>
      ) : (
        <ThemedView
          style={[
            styles.rewardsContainer,
            { backgroundColor: theme.background },
          ]}
        >
          <ThemedText type="title" style={{ color: theme.text }}>
            Lion Rewards
          </ThemedText>

          <ThemedView
            style={[
              styles.rewardsCounterContainer,
              {
                backgroundColor: theme.elevatedCard,
                borderColor: theme.border,
              },
            ]}
          >
            <ThemedText
              style={[styles.rewardsText, { color: theme.mutedText }]}
            >
              Points
            </ThemedText>

            <ThemedText
              style={[styles.rewardsTextPoints, { color: theme.text }]}
            >
              {loading
                ? "Loading..."
                : userRewards
                  ? `${userRewards.rewardPoints.toString()}`
                  : "0"}
            </ThemedText>

            <ThemedView
              style={[
                styles.rewardsBarContainer,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.barBackground,
                },
              ]}
            >
              <LinearGradient
                style={[
                  styles.rewardsBarMeter,
                  {
                    width: userRewards
                      ? `${Math.min(
                          (userRewards.rewardPoints / 100) * 100,
                          100,
                        )}%`
                      : "0%",
                  },
                ]}
                colors={[theme.darkGreen, theme.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </ThemedView>
          </ThemedView>

          <ThemedText style={[styles.rewardsMenuText, { color: theme.text }]}>
            Rewards Menu
          </ThemedText>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <ThemedView
                style={[
                  styles.rewardsCardsContainer,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <ThemedText
                  style={[styles.rewardsCardText, { color: theme.text }]}
                >
                  Loading...
                </ThemedText>
              </ThemedView>
            ) : rewardOfferings.length > 0 ? (
              rewardOfferings.map((offering, index) => (
                <ThemedView
                  key={offering.id || index}
                  style={[
                    styles.rewardsCardsContainer,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1637&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    }}
                    style={styles.image}
                  />

                  <ThemedView
                    style={[
                      styles.cardContent,
                      { backgroundColor: theme.card },
                    ]}
                  >
                    <ThemedText
                      style={[styles.rewardsCardTitle, { color: theme.text }]}
                    >
                      {offering.name || "Unnamed Reward"}
                    </ThemedText>

                    <ThemedText
                      style={[
                        styles.rewardsCardDescription,
                        { color: theme.mutedText },
                      ]}
                    >
                      {offering.description || "No description available"}
                    </ThemedText>

                    <ThemedText
                      style={[
                        styles.rewardsCardPoints,
                        { color: theme.accent },
                      ]}
                    >
                      {(offering.pointsRequired || 0).toString()} points
                      required
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              ))
            ) : (
              <ThemedView
                style={[
                  styles.rewardsCardsContainer,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <ThemedText
                  style={[styles.rewardsCardText, { color: theme.text }]}
                >
                  No rewards available
                </ThemedText>
              </ThemedView>
            )}
          </ScrollView>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  rewardsContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
  },
  rewardsCounterContainer: {
    borderRadius: 10,
    marginTop: 20,
    height: 220,
    alignItems: "center",
    paddingTop: 50,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  rewardsText: {
    fontSize: 16,
    fontWeight: "300",
  },
  rewardsTextPoints: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold",
  },
  rewardsBarContainer: {
    borderWidth: 1,
    borderRadius: 12,
    width: "80%",
    height: 20,
    marginTop: 40,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  rewardsBarMeter: {
    height: 14,
    borderRadius: 12,
  },
  rewardsMenuText: {
    fontSize: 20,
    marginTop: 30,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  rewardsCardsContainer: {
    borderRadius: 10,
    minHeight: 120,
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  rewardsCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  rewardsCardDescription: {
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 18,
  },
  rewardsCardPoints: {
    fontSize: 14,
    fontWeight: "600",
  },
  rewardsCardText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 14,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
