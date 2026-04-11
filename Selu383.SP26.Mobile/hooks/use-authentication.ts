import { getCurrentUser } from "@/services/apis";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

export function useAuthentication() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const userData = await getCurrentUser();
      setIsLoggedIn(!!userData);
    } catch (error) {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      checkAuth();
    }, [checkAuth]),
  );

  return { isLoggedIn, loading, checkAuth };
}
