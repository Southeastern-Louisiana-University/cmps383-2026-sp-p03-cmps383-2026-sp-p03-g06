import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
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
  const { addOrderItem } = useOrder();

  const menuItem: MenuItemDto = JSON.parse(params.item as string);
  const [categoryName, setCategoryName] = useState("");
  //Category customization visibility
  const showSizeOptions = [33].includes(menuItem.categoryId);
  const showMilkOptions = [33].includes(menuItem.categoryId);
  const showShotOptions = [33].includes(menuItem.categoryId);
  const showTemperatureOptions = [34, 35, 36].includes(menuItem.categoryId);

  //Crepes option filters based on categoryID
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

    addOrderItem({
      menuItemId: menuItem.id,
      quantity: quantity,
      customizationJson: JSON.stringify(customization),
    });

    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <ThemedView style={styles.fixedHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.backButtonText}>
              <AntDesign name="arrow-left" size={24} color="black" />
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <ThemedView style={styles.itemHeader}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1637&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
              style={styles.itemImage}
            />
            <ThemedText style={styles.itemName}>{menuItem.name}</ThemedText>
            <ThemedText style={styles.itemDescription}>
              {menuItem.description || "Delicious coffee beverage"}
            </ThemedText>
            <ThemedText style={styles.itemPrice}>
              ${calculatePrice().toFixed(2)}
            </ThemedText>
          </ThemedView>

          {/* Quantity Selection */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Quantity</ThemedText>
            <ThemedView style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                <ThemedText style={styles.quantityButtonText}>-</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.quantityText}>
                {quantity.toString()}
              </ThemedText>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <ThemedText style={styles.quantityButtonText}>+</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          {/* Drink Size */}
          {showSizeOptions && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Drink Size</ThemedText>
              <View style={styles.optionsGrid}>
                {DRINK_SIZES.map((size) => (
                  <TouchableOpacity
                    key={size.value}
                    style={[
                      styles.optionButton,
                      selectedSize === size.value &&
                        styles.optionButtonSelected,
                    ]}
                    onPress={() => setSelectedSize(size.value)}
                  >
                    <ThemedText
                      style={[
                        styles.optionText,
                        selectedSize === size.value &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {size.label}
                    </ThemedText>
                    {size.price > 0 && (
                      <ThemedText style={styles.optionPrice}>
                        +${size.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}

          {/* Milk Type*/}
          {showMilkOptions && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Milk Type</ThemedText>
              <View style={styles.optionsGrid}>
                {MILK_OPTIONS.map((milk) => (
                  <TouchableOpacity
                    key={milk.value}
                    style={[
                      styles.optionButton,
                      selectedMilk === milk.value &&
                        styles.optionButtonSelected,
                    ]}
                    onPress={() => setSelectedMilk(milk.value)}
                  >
                    <ThemedText
                      style={[
                        styles.optionText,
                        selectedMilk === milk.value &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {milk.label}
                    </ThemedText>
                    {milk.price > 0 && (
                      <ThemedText style={styles.optionPrice}>
                        +${milk.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}

          {/* Espresso Shots*/}
          {showShotOptions && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                Espresso Shots
              </ThemedText>
              <View style={styles.optionsGrid}>
                {SHOT_OPTIONS.map((shot) => (
                  <TouchableOpacity
                    key={shot.value}
                    style={[
                      styles.optionButton,
                      selectedShot === shot.value &&
                        styles.optionButtonSelected,
                    ]}
                    onPress={() => setSelectedShot(shot.value)}
                  >
                    <ThemedText
                      style={[
                        styles.optionText,
                        selectedShot === shot.value &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {shot.label}
                    </ThemedText>
                    {shot.price > 0 && (
                      <ThemedText style={styles.optionPrice}>
                        +${shot.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}

          {/* Temperature Selection*/}
          {showTemperatureOptions && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Temperature</ThemedText>
              <View style={styles.optionsGrid}>
                {TEMPERATURE_OPTIONS.map((temp) => (
                  <TouchableOpacity
                    key={temp.value}
                    style={[
                      styles.optionButton,
                      selectedTemperature === temp.value &&
                        styles.optionButtonSelected,
                    ]}
                    onPress={() => setSelectedTemperature(temp.value)}
                  >
                    <ThemedText
                      style={[
                        styles.optionText,
                        selectedTemperature === temp.value &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {temp.label}
                    </ThemedText>
                    {temp.price > 0 && (
                      <ThemedText style={styles.optionPrice}>
                        +${temp.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}

          {/* Filling Selection */}
          {showFillingOptions && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Fillings</ThemedText>
              <View style={styles.optionsGrid}>
                {FILLING_OPTIONS.map((filling) => (
                  <TouchableOpacity
                    key={filling.value}
                    style={[
                      styles.optionButton,
                      selectedFilling === filling.value &&
                        styles.optionButtonSelected,
                    ]}
                    onPress={() => setSelectedFilling(filling.value)}
                  >
                    <ThemedText
                      style={[
                        styles.optionText,
                        selectedFilling === filling.value &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {filling.label}
                    </ThemedText>
                    {filling.price > 0 && (
                      <ThemedText style={styles.optionPrice}>
                        +${filling.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}

          {/* Toppings */}
          {showToppingOptions && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Toppings</ThemedText>
              <View style={styles.optionsGrid}>
                {TOPPING_OPTIONS.map((topping) => (
                  <TouchableOpacity
                    key={topping.value}
                    style={[
                      styles.optionButton,
                      selectedTopping === topping.value &&
                        styles.optionButtonSelected,
                    ]}
                    onPress={() => setSelectedTopping(topping.value)}
                  >
                    <ThemedText
                      style={[
                        styles.optionText,
                        selectedTopping === topping.value &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {topping.label}
                    </ThemedText>
                    {topping.price > 0 && (
                      <ThemedText style={styles.optionPrice}>
                        +${topping.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}

          {/* Proteins */}
          {showProteinOptions && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Proteins</ThemedText>
              <View style={styles.optionsGrid}>
                {PROTEIN_OPTIONS.map((protein) => (
                  <TouchableOpacity
                    key={protein.value}
                    style={[
                      styles.optionButton,
                      selectedProtein === protein.value &&
                        styles.optionButtonSelected,
                    ]}
                    onPress={() => setSelectedProtein(protein.value)}
                  >
                    <ThemedText
                      style={[
                        styles.optionText,
                        selectedProtein === protein.value &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {protein.label}
                    </ThemedText>
                    {protein.price > 0 && (
                      <ThemedText style={styles.optionPrice}>
                        +${protein.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}

          {/* Cheeses */}
          {showCheeseOptions && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Cheeses</ThemedText>
              <View style={styles.optionsGrid}>
                {CHEESE_OPTIONS.map((cheese) => (
                  <TouchableOpacity
                    key={cheese.value}
                    style={[
                      styles.optionButton,
                      selectedCheese === cheese.value &&
                        styles.optionButtonSelected,
                    ]}
                    onPress={() => setSelectedCheese(cheese.value)}
                  >
                    <ThemedText
                      style={[
                        styles.optionText,
                        selectedCheese === cheese.value &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {cheese.label}
                    </ThemedText>
                    {cheese.price > 0 && (
                      <ThemedText style={styles.optionPrice}>
                        +${cheese.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}

          {/* Veggies */}
          {showVeggyOptions && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Vegetables</ThemedText>
              <View style={styles.optionsGrid}>
                {VEGGY_OPTIONS.map((veggy) => (
                  <TouchableOpacity
                    key={veggy.value}
                    style={[
                      styles.optionButton,
                      selectedVeggy === veggy.value &&
                        styles.optionButtonSelected,
                    ]}
                    onPress={() => setSelectedVeggy(veggy.value)}
                  >
                    <ThemedText
                      style={[
                        styles.optionText,
                        selectedVeggy === veggy.value &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {veggy.label}
                    </ThemedText>
                    {veggy.price > 0 && (
                      <ThemedText style={styles.optionPrice}>
                        +${veggy.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}
        </ScrollView>

        {/* Floating Add to Cart Button */}
        <TouchableOpacity
          style={styles.floatingAddButton}
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
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for floating button
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  fixedHeader: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#666",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
  },
  itemHeader: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
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
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: "#434242",
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
    backgroundColor: "#7bf1a8",
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
    backgroundColor: "#7bf1a8",
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
    borderColor: "#e0e0e0",
    backgroundColor: "#f8f9fa",
    minWidth: "30%",
    alignItems: "center",
  },
  optionButtonSelected: {
    borderColor: "#7bf1a8",
    backgroundColor: "#e8f9ea",
  },
  optionText: {
    fontSize: 14,
    color: "#434242",
  },
  optionTextSelected: {
    fontWeight: "600",
    color: "#2d5a3d",
  },
  optionPrice: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});
