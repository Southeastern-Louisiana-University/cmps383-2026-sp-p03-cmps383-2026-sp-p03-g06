import React, { createContext, useContext, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

type ColorSchemePreference = "light" | "dark" | "system";

interface ColorSchemeContextType {
  colorScheme: "light" | "dark";
  colorSchemePreference: ColorSchemePreference;
  setColorSchemePreference: (preference: ColorSchemePreference) => void;
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(
  undefined,
);

export function ColorSchemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemColorScheme = useRNColorScheme();
  const [colorSchemePreference, setColorSchemePreferenceState] =
    useState<ColorSchemePreference>("system");

  const setColorSchemePreference = (preference: ColorSchemePreference) => {
    setColorSchemePreferenceState(preference);
  };

  const colorScheme =
    colorSchemePreference === "system"
      ? systemColorScheme || "light"
      : colorSchemePreference;

  return (
    <ColorSchemeContext.Provider
      value={{
        colorScheme: colorScheme as "light" | "dark",
        colorSchemePreference,
        setColorSchemePreference,
      }}
    >
      {children}
    </ColorSchemeContext.Provider>
  );
}

export function useColorScheme() {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) {
    throw new Error("useColorScheme must be used within a ColorSchemeProvider");
  }
  return context;
}
