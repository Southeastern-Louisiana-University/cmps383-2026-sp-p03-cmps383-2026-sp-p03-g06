import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getTheme } from "@/constants/theme";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useOrder } from "@/contexts/OrderContext";
import {
  CheeseOption,
  DrinkCustomization,
  DrinkSize,
  FillingOption,
  MenuItemDto,
  MilkType,
  ProteinOption,
  ShotOption,
  TemperatureOption,
  ToppingOption,
  VeggyOption,
} from "@/services/types";
import {
  calculateCartItemTotal,
  CHEESE_OPTIONS,
  DRINK_SIZES,
  FILLING_OPTIONS,
  MILK_OPTIONS,
  PROTEIN_OPTIONS,
  SHOT_OPTIONS,
  TEMPERATURE_OPTIONS,
  TOPPING_OPTIONS,
  VEGGY_OPTIONS,
} from "@/utils/pricing";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function ItemCustomizationScreen() {
  const params = useLocalSearchParams();
  const {
    addOrderItem,
    selectedReward,
    rewardedMenuItemId,
    setRewardedMenuItemId,
    setRewardedCustomizationJson,
  } = useOrder();
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);

  const menuItem: MenuItemDto = JSON.parse(params.item as string);

  const showSizeOptions = [33].includes(menuItem.categoryId);
  const showMilkOptions = [33].includes(menuItem.categoryId);
  const showShotOptions = [33].includes(menuItem.categoryId);
  const showTemperatureOptions = [34, 35, 36].includes(menuItem.categoryId);

  const showFillingOptions = [34, 35, 36].includes(menuItem.categoryId);
  const showToppingOptions = [34, 35, 36].includes(menuItem.categoryId);
  const showProteinOptions = [34, 35, 36].includes(menuItem.categoryId);
  const showCheeseOptions = [34, 35, 36].includes(menuItem.categoryId);
  const showVeggyOptions = [34, 35, 36].includes(menuItem.categoryId);

  const [quantity, setQuantity] = useState(1);
  const [selectedMilk, setSelectedMilk] = useState<MilkType>("whole");
  const [selectedSize, setSelectedSize] = useState<DrinkSize>("small");
  const [selectedShot, setSelectedShot] = useState<ShotOption>(0);
  const [selectedTemperature, setSelectedTemperature] =
    useState<TemperatureOption>("hot");
  const [selectedFilling, setSelectedFilling] = useState<FillingOption>("none");
  const [selectedTopping, setSelectedTopping] = useState<ToppingOption>("none");
  const [selectedProtein, setSelectedProtein] = useState<ProteinOption>("none");
  const [selectedCheese, setSelectedCheese] = useState<CheeseOption>("none");
  const [selectedVeggy, setSelectedVeggy] = useState<VeggyOption>("none");

  const calculatePrice = () => {
    const customization: DrinkCustomization = {
      milkType: selectedMilk,
      drinkSize: selectedSize,
      shotCount: selectedShot,
      temperature: selectedTemperature,
      filling: selectedFilling,
      topping: selectedTopping,
      protein: selectedProtein,
      cheese: selectedCheese,
      veggy: selectedVeggy,
    };

    return calculateCartItemTotal({
      basePrice: menuItem.price,
      quantity,
      customizationJson: JSON.stringify(customization),
    });
  };

  const handleAddToOrder = () => {
    const customization: DrinkCustomization = {
      milkType: selectedMilk,
      drinkSize: selectedSize,
      shotCount: selectedShot,
      temperature: selectedTemperature,
      filling: selectedFilling,
      topping: selectedTopping,
      protein: selectedProtein,
      cheese: selectedCheese,
      veggy: selectedVeggy,
    };

    const defaultCustomization: DrinkCustomization = {
      milkType: "whole",
      drinkSize: "small",
      shotCount: 0,
      temperature: "hot",
      filling: "none",
      topping: "none",
      protein: "none",
      cheese: "none",
      veggy: "none",
    };

    const cleanedCustomization = Object.fromEntries(
      Object.entries(customization).filter(([key, value]) => {
        if (value === null || value === undefined || value === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;

        const defaultValue =
          defaultCustomization[key as keyof DrinkCustomization];

        if (value === defaultValue) return false;

        return true;
      }),
    );

    const customizationJson =
      Object.keys(cleanedCustomization).length > 0
        ? JSON.stringify(cleanedCustomization)
        : undefined;

    addOrderItem({
      menuItemId: menuItem.id,
      quantity,
      customizationJson,
    });

    if (selectedReward && !rewardedMenuItemId) {
      setRewardedMenuItemId(menuItem.id);
      setRewardedCustomizationJson(customizationJson);
    }

    router.back();
  };
  const getOptionButtonStyle = (isSelected: boolean) => [
    styles.optionButton,
    {
      backgroundColor: isSelected
        ? theme.isDark
          ? theme.darkGreen
          : "#e8f9ea"
        : theme.inputBackground,
      borderColor: isSelected ? theme.accent : theme.border,
    },
  ];

  const getOptionTextStyle = (isSelected: boolean) => [
    styles.optionText,
    {
      color: isSelected
        ? theme.isDark
          ? "#ffffff"
          : "#2d5a3d"
        : theme.softText,
      fontWeight: isSelected ? ("600" as const) : ("400" as const),
    },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ThemedView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <ThemedView
          style={[
            styles.fixedHeader,
            {
              backgroundColor: theme.background,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: theme.inputBackground },
            ]}
            onPress={() => router.back()}
          >
            <AntDesign name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
        </ThemedView>

        <ScrollView
          style={[styles.scrollView, { backgroundColor: theme.background }]}
          contentContainerStyle={styles.scrollContent}
        >
          <ThemedView
            style={[
              styles.itemHeader,
              {
                backgroundColor: theme.background,
                borderBottomColor: theme.border,
              },
            ]}
          >
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1637&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
              style={styles.itemImage}
            />

            <ThemedText style={[styles.itemName, { color: theme.text }]}>
              {menuItem.name}
            </ThemedText>

            <ThemedText
              style={[styles.itemDescription, { color: theme.mutedText }]}
            >
              {menuItem.description || "Delicious coffee beverage"}
            </ThemedText>

            <ThemedText style={[styles.itemPrice, { color: theme.softText }]}>
              ${calculatePrice().toFixed(2)}
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={[styles.section, { backgroundColor: theme.background }]}
          >
            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
              Quantity
            </ThemedText>

            <ThemedView
              style={[
                styles.quantityContainer,
                { backgroundColor: theme.background },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  { backgroundColor: theme.accent },
                ]}
                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                <ThemedText style={styles.quantityButtonText}>-</ThemedText>
              </TouchableOpacity>

              <ThemedText style={[styles.quantityText, { color: theme.text }]}>
                {quantity.toString()}
              </ThemedText>

              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  { backgroundColor: theme.accent },
                ]}
                onPress={() => setQuantity(quantity + 1)}
              >
                <ThemedText style={styles.quantityButtonText}>+</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          {showSizeOptions && (
            <ThemedView
              style={[styles.section, { backgroundColor: theme.background }]}
            >
              <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                Drink Size
              </ThemedText>
              <View style={styles.optionsGrid}>
                {DRINK_SIZES.map((size) => (
                  <TouchableOpacity
                    key={size.value}
                    style={getOptionButtonStyle(selectedSize === size.value)}
                    onPress={() => setSelectedSize(size.value)}
                  >
                    <ThemedText
                      style={getOptionTextStyle(selectedSize === size.value)}
                    >
                      {size.label}
                    </ThemedText>
                    {size.price > 0 && (
                      <ThemedText
                        style={[styles.optionPrice, { color: theme.mutedText }]}
                      >
                        +${size.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}

          {showMilkOptions && (
            <ThemedView
              style={[styles.section, { backgroundColor: theme.background }]}
            >
              <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                Milk Type
              </ThemedText>
              <View style={styles.optionsGrid}>
                {MILK_OPTIONS.map((milk) => (
                  <TouchableOpacity
                    key={milk.value}
                    style={getOptionButtonStyle(selectedMilk === milk.value)}
                    onPress={() => setSelectedMilk(milk.value)}
                  >
                    <ThemedText
                      style={getOptionTextStyle(selectedMilk === milk.value)}
                    >
                      {milk.label}
                    </ThemedText>
                    {milk.price > 0 && (
                      <ThemedText
                        style={[styles.optionPrice, { color: theme.mutedText }]}
                      >
                        +${milk.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}

          {showShotOptions && (
            <ThemedView
              style={[styles.section, { backgroundColor: theme.background }]}
            >
              <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                Espresso Shots
              </ThemedText>
              <View style={styles.optionsGrid}>
                {SHOT_OPTIONS.map((shot) => (
                  <TouchableOpacity
                    key={shot.value}
                    style={getOptionButtonStyle(selectedShot === shot.value)}
                    onPress={() => setSelectedShot(shot.value)}
                  >
                    <ThemedText
                      style={getOptionTextStyle(selectedShot === shot.value)}
                    >
                      {shot.label}
                    </ThemedText>
                    {shot.price > 0 && (
                      <ThemedText
                        style={[styles.optionPrice, { color: theme.mutedText }]}
                      >
                        +${shot.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}

          {showTemperatureOptions && (
            <ThemedView
              style={[styles.section, { backgroundColor: theme.background }]}
            >
              <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                Temperature
              </ThemedText>
              <View style={styles.optionsGrid}>
                {TEMPERATURE_OPTIONS.map((temp) => (
                  <TouchableOpacity
                    key={temp.value}
                    style={getOptionButtonStyle(
                      selectedTemperature === temp.value,
                    )}
                    onPress={() => setSelectedTemperature(temp.value)}
                  >
                    <ThemedText
                      style={getOptionTextStyle(
                        selectedTemperature === temp.value,
                      )}
                    >
                      {temp.label}
                    </ThemedText>
                    {temp.price > 0 && (
                      <ThemedText
                        style={[styles.optionPrice, { color: theme.mutedText }]}
                      >
                        +${temp.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}

          {showFillingOptions && (
            <ThemedView
              style={[styles.section, { backgroundColor: theme.background }]}
            >
              <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                Fillings
              </ThemedText>
              <View style={styles.optionsGrid}>
                {FILLING_OPTIONS.map((filling) => (
                  <TouchableOpacity
                    key={filling.value}
                    style={getOptionButtonStyle(
                      selectedFilling === filling.value,
                    )}
                    onPress={() => setSelectedFilling(filling.value)}
                  >
                    <ThemedText
                      style={getOptionTextStyle(
                        selectedFilling === filling.value,
                      )}
                    >
                      {filling.label}
                    </ThemedText>
                    {filling.price > 0 && (
                      <ThemedText
                        style={[styles.optionPrice, { color: theme.mutedText }]}
                      >
                        +${filling.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}

          {showToppingOptions && (
            <ThemedView
              style={[styles.section, { backgroundColor: theme.background }]}
            >
              <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                Toppings
              </ThemedText>
              <View style={styles.optionsGrid}>
                {TOPPING_OPTIONS.map((topping) => (
                  <TouchableOpacity
                    key={topping.value}
                    style={getOptionButtonStyle(
                      selectedTopping === topping.value,
                    )}
                    onPress={() => setSelectedTopping(topping.value)}
                  >
                    <ThemedText
                      style={getOptionTextStyle(
                        selectedTopping === topping.value,
                      )}
                    >
                      {topping.label}
                    </ThemedText>
                    {topping.price > 0 && (
                      <ThemedText
                        style={[styles.optionPrice, { color: theme.mutedText }]}
                      >
                        +${topping.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}

          {showProteinOptions && (
            <ThemedView
              style={[styles.section, { backgroundColor: theme.background }]}
            >
              <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                Proteins
              </ThemedText>
              <View style={styles.optionsGrid}>
                {PROTEIN_OPTIONS.map((protein) => (
                  <TouchableOpacity
                    key={protein.value}
                    style={getOptionButtonStyle(
                      selectedProtein === protein.value,
                    )}
                    onPress={() => setSelectedProtein(protein.value)}
                  >
                    <ThemedText
                      style={getOptionTextStyle(
                        selectedProtein === protein.value,
                      )}
                    >
                      {protein.label}
                    </ThemedText>
                    {protein.price > 0 && (
                      <ThemedText
                        style={[styles.optionPrice, { color: theme.mutedText }]}
                      >
                        +${protein.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}

          {showCheeseOptions && (
            <ThemedView
              style={[styles.section, { backgroundColor: theme.background }]}
            >
              <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                Cheeses
              </ThemedText>
              <View style={styles.optionsGrid}>
                {CHEESE_OPTIONS.map((cheese) => (
                  <TouchableOpacity
                    key={cheese.value}
                    style={getOptionButtonStyle(
                      selectedCheese === cheese.value,
                    )}
                    onPress={() => setSelectedCheese(cheese.value)}
                  >
                    <ThemedText
                      style={getOptionTextStyle(
                        selectedCheese === cheese.value,
                      )}
                    >
                      {cheese.label}
                    </ThemedText>
                    {cheese.price > 0 && (
                      <ThemedText
                        style={[styles.optionPrice, { color: theme.mutedText }]}
                      >
                        +${cheese.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}

          {showVeggyOptions && (
            <ThemedView
              style={[styles.section, { backgroundColor: theme.background }]}
            >
              <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                Vegetables
              </ThemedText>
              <View style={styles.optionsGrid}>
                {VEGGY_OPTIONS.map((veggy) => (
                  <TouchableOpacity
                    key={veggy.value}
                    style={getOptionButtonStyle(selectedVeggy === veggy.value)}
                    onPress={() => setSelectedVeggy(veggy.value)}
                  >
                    <ThemedText
                      style={getOptionTextStyle(selectedVeggy === veggy.value)}
                    >
                      {veggy.label}
                    </ThemedText>
                    {veggy.price > 0 && (
                      <ThemedText
                        style={[styles.optionPrice, { color: theme.mutedText }]}
                      >
                        +${veggy.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}
        </ScrollView>

        <TouchableOpacity
          style={[styles.floatingAddButton, { backgroundColor: theme.accent }]}
          onPress={handleAddToOrder}
        >
          <ThemedText style={styles.addButtonText}>
            Add to Cart - ${calculatePrice().toFixed(2)}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 25,
    borderBottomWidth: 1,
  },
  fixedHeader: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 15,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  itemHeader: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  itemImage: {
    width: 200,
    height: 150,
    borderRadius: 15,
    resizeMode: "cover",
    marginBottom: 15,
  },
  itemName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "600",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#434242",
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "600",
    minWidth: 30,
    textAlign: "center",
  },
  floatingAddButton: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  addButtonText: {
    color: "#434242",
    fontSize: 18,
    fontWeight: "bold",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: "30%",
    alignItems: "center",
  },
  optionText: {
    fontSize: 14,
  },
  optionPrice: {
    fontSize: 12,
    marginTop: 4,
  },
});
