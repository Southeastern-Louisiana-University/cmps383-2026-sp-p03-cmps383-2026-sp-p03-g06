/**
 * Centralized theme system for the entire app
 */

import { Platform } from "react-native";

const tintColorLight = "#7bf1a8";
const tintColorDark = "#7bf1a8";

export const Colors = {
  light: {
    isDark: false,
    // Core
    text: "#111111",
    background: "#F4F6F8", // instead of pure white
    card: "#FFFFFF",
    elevatedCard: "#EEF2F6",

    // UI
    border: "#D6DCE3", // a little stronger
    inputBorder: "#C9D2DC",
    inputBackground: "#F1F4F8",

    // Text variants
    mutedText: "#6B7280",
    softText: "#4B5563",

    // Brand
    tint: tintColorLight,
    accent: "#7bf1a8",
    accentDark: "#5bb377",
    darkGreen: "#395a46",

    // Icons / Tabs
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    tabBackground: "#ffffff",

    // Status
    success: "#28a745",
    danger: "#dc3545",

    // Misc
    shadow: "#000000",
  },

  dark: {
    isDark: true,
    // Core
    text: "#f5f5f5",
    background: "#121212",
    card: "#1e1e1e",
    elevatedCard: "#242424",

    // UI
    border: "#2a2a2a",
    inputBorder: "#333333",
    inputBackground: "#1e1e1e",

    // Text variants
    mutedText: "#b5b5b5",
    softText: "#d1d5db",

    // Brand
    tint: tintColorDark,
    accent: "#7bf1a8",
    accentDark: "#5bb377",
    darkGreen: "#395a46",

    // Icons / Tabs
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    tabBackground: "#121212",

    // Status
    success: "#28a745",
    danger: "#dc3545",

    // Misc
    shadow: "#000000",
  },
};

/**
 * Helper so you don’t have to keep doing Colors[colorScheme]
 */
export function getTheme(colorScheme: "light" | "dark") {
  return Colors[colorScheme];
}

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
    roboto: "Roboto",
  },
  android: {
    roboto: "Roboto",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
