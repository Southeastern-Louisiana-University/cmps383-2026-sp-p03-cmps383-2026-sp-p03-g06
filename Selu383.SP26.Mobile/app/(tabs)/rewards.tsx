import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthentication } from "@/hooks/use-authentication";
import { getMyRewards, getRewardOfferings } from "@/services/apis";
import { RewardOfferingDto, UserRewardsDto } from "@/services/types";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

export default function RewardsScreen() {
  const [rewardOfferings, setRewardOfferings] = useState<RewardOfferingDto[]>(
    [],
  );
  const [userRewards, setUserRewards] = useState<UserRewardsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, loading: authLoading } = useAuthentication();

  useEffect(() => {
    if (!isLoggedIn || authLoading) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch both offerings and user rewards
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
  }, [isLoggedIn, authLoading]);
  return (
    <ThemedView style={styles.container}>
      {authLoading ? (
        <ThemedView style={styles.centerContainer}>
          <ThemedText>Loading...</ThemedText>
        </ThemedView>
      ) : !isLoggedIn ? (
        <ThemedView style={styles.centerContainer}>
          <ThemedText type="title" style={styles.loginPromptTitle}>
            Login Required
          </ThemedText>
          <ThemedText style={styles.loginPromptText}>
            Please log in to view your rewards and points.
          </ThemedText>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/login")}
          >
            <ThemedText style={styles.loginButtonText}>Go to Login</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <ThemedView style={styles.rewardsContainer}>
          <ThemedText type="title">Lion Rewards</ThemedText>
          <ThemedView style={styles.rewardsCounterContainer}>
            <ThemedText style={styles.rewardsText}>Points</ThemedText>
            <ThemedText style={styles.rewardsTextPoints}>
              {loading
                ? "Loading..."
                : userRewards
                  ? `${userRewards.rewardPoints.toString()}`
                  : "0"}
            </ThemedText>
            <ThemedView style={styles.rewardsBarContainer}>
              <LinearGradient
                style={[
                  styles.rewardsBarMeter,
                  {
                    width: userRewards
                      ? `${Math.min((userRewards.rewardPoints / 100) * 100, 100)}%`
                      : "0%",
                  },
                ]}
                colors={["#395a46", "#6fe39a"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </ThemedView>
          </ThemedView>
          <ThemedText style={styles.rewardsMenuText}>Rewards Menu</ThemedText>
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <ThemedView style={styles.rewardsCardsContainer}>
                <ThemedText style={styles.rewardsCardText}>
                  Loading...
                </ThemedText>
              </ThemedView>
            ) : rewardOfferings.length > 0 ? (
              rewardOfferings.map((offering, index) => (
                <ThemedView
                  key={offering.id || index}
                  style={styles.rewardsCardsContainer}
                >
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1637&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    }}
                    style={styles.image}
                  />
                  <ThemedView style={styles.cardContent}>
                    <ThemedText style={styles.rewardsCardTitle}>
                      {offering.name || "Unnamed Reward"}
                    </ThemedText>
                    <ThemedText style={styles.rewardsCardDescription}>
                      {offering.description || "No description available"}
                    </ThemedText>
                    <ThemedText style={styles.rewardsCardPoints}>
                      {(offering.pointsRequired || 0).toString()} points
                      required
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              ))
            ) : (
              <ThemedView style={styles.rewardsCardsContainer}>
                <ThemedText style={styles.rewardsCardText}>
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
    padding: 20,
    paddingTop: 80,
  },
  rewardsCounterContainer: {
    borderRadius: 10,
    marginTop: 20,
    height: 220,
    alignItems: "center",
    paddingTop: 50,
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
    color: "#434242",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  rewardsTextPoints: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold",
    color: "#434242",
  },
  rewardsTextContainer: {
    fontSize: 16,
  },
  rewardsBarContainer: {
    borderWidth: 1,
    borderColor: "#434242",
    backgroundColor: "#434242",
    borderRadius: 12,
    width: "80%",
    height: 20,
    marginTop: 40,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  rewardsBarMeter: {
    height: 14,
    width: "70%",
    borderRadius: 12,
  },
  rewardsMenuText: {
    fontSize: 20,
    marginTop: 30,
    marginBottom: 20,
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
    color: "#434242",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  rewardsCardsContainer: {
    borderRadius: 10,
    minHeight: 120,
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 15,
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
    color: "#434242",
    marginBottom: 5,
  },
  rewardsCardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    lineHeight: 18,
  },
  rewardsCardPoints: {
    fontSize: 14,
    fontWeight: "600",
    color: "#395a46",
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
  loginPromptTitle: {
    marginBottom: 15,
    textAlign: "center",
    color: "#434242",
  },
  loginPromptText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: "#395a46",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
