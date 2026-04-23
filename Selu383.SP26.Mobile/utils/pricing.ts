import {
    CheeseOption,
    DrinkCustomization,
    DrinkSize,
    FillingOption,
    MilkType,
    ProteinOption,
    ShotOption,
    TemperatureOption,
    ToppingOption,
    VeggyOption,
} from "@/services/types";

export const MILK_OPTIONS: { value: MilkType; label: string; price: number }[] =
  [
    { value: "whole", label: "Whole Milk", price: 0 },
    { value: "skim", label: "Skim Milk", price: 0 },
    { value: "oat", label: "Oat Milk", price: 0.7 },
    { value: "almond", label: "Almond Milk", price: 0.7 },
    { value: "soy", label: "Soy Milk", price: 0.5 },
    { value: "none", label: "No Milk", price: 0 },
  ];

export const DRINK_SIZES: { value: DrinkSize; label: string; price: number }[] =
  [
    { value: "small", label: "Small", price: 0 },
    { value: "medium", label: "Medium", price: 0.5 },
    { value: "large", label: "Large", price: 1 },
  ];

export const SHOT_OPTIONS: {
  value: ShotOption;
  label: string;
  price: number;
}[] = [
  { value: 0, label: "0 Shots", price: 0 },
  { value: 1, label: "1 Shot", price: 0.5 },
  { value: 2, label: "2 Shots", price: 1 },
  { value: 3, label: "3 Shots", price: 1.5 },
  { value: 4, label: "4 Shots", price: 2 },
  { value: 5, label: "5 Shots", price: 2.5 },
];

export const TEMPERATURE_OPTIONS: {
  value: TemperatureOption;
  label: string;
  price: number;
}[] = [
  { value: "hot", label: "Hot", price: 0 },
  { value: "warm", label: "Warm", price: 0.5 },
  { value: "chilled", label: "Chilled", price: 0.5 },
];

export const FILLING_OPTIONS: {
  value: FillingOption;
  label: string;
  price: number;
}[] = [
  { value: "none", label: "No Filling", price: 0 },
  { value: "chocolate", label: "Chocolate", price: 0.5 },
  { value: "strawberry", label: "Strawberry", price: 0.5 },
  { value: "vanilla", label: "Vanilla", price: 0.5 },
  { value: "caramel", label: "Caramel", price: 0.5 },
];

export const TOPPING_OPTIONS: {
  value: ToppingOption;
  label: string;
  price: number;
}[] = [
  { value: "none", label: "No Topping", price: 0 },
  { value: "whippedCream", label: "Whipped Cream", price: 0.5 },
  { value: "powderedSugar", label: "Powdered Sugar", price: 0.5 },
  { value: "freshFruit", label: "Fresh Fruit", price: 0.5 },
];

export const PROTEIN_OPTIONS: {
  value: ProteinOption;
  label: string;
  price: number;
}[] = [
  { value: "none", label: "No Protein", price: 0 },
  { value: "bacon", label: "Bacon", price: 1.5 },
  { value: "ham", label: "Ham", price: 2 },
  { value: "egg", label: "Egg", price: 1.5 },
];

export const CHEESE_OPTIONS: {
  value: CheeseOption;
  label: string;
  price: number;
}[] = [
  { value: "none", label: "No Cheese", price: 0 },
  { value: "cheddar", label: "Cheddar", price: 1 },
  { value: "swiss", label: "Swiss", price: 1 },
  { value: "provolone", label: "Provolone", price: 1 },
];

export const VEGGY_OPTIONS: {
  value: VeggyOption;
  label: string;
  price: number;
}[] = [
  { value: "none", label: "No Veggies", price: 0 },
  { value: "spinach", label: "Spinach", price: 0.5 },
  { value: "mushroom", label: "Mushrooms", price: 0.5 },
  { value: "tomato", label: "Tomatoes", price: 0.5 },
];

export function parseCustomization(
  customizationJson?: string,
): Partial<DrinkCustomization> | null {
  if (!customizationJson) return null;

  try {
    return JSON.parse(customizationJson) as Partial<DrinkCustomization>;
  } catch (error) {
    console.error("Failed to parse customizationJson:", error);
    return null;
  }
}

export function calculateCustomizationPrice(
  customization?: Partial<DrinkCustomization> | null,
): number {
  if (!customization) return 0;

  const milkPrice =
    MILK_OPTIONS.find((m) => m.value === customization.milkType)?.price || 0;

  const sizePrice =
    DRINK_SIZES.find((s) => s.value === customization.drinkSize)?.price || 0;

  const shotPrice =
    SHOT_OPTIONS.find((s) => s.value === customization.shotCount)?.price || 0;

  const temperaturePrice =
    TEMPERATURE_OPTIONS.find((t) => t.value === customization.temperature)
      ?.price || 0;

  const fillingPrice =
    FILLING_OPTIONS.find((f) => f.value === customization.filling)?.price || 0;

  const toppingPrice =
    TOPPING_OPTIONS.find((t) => t.value === customization.topping)?.price || 0;

  const proteinPrice =
    PROTEIN_OPTIONS.find((p) => p.value === customization.protein)?.price || 0;

  const cheesePrice =
    CHEESE_OPTIONS.find((c) => c.value === customization.cheese)?.price || 0;

  const veggyPrice =
    VEGGY_OPTIONS.find((v) => v.value === customization.veggy)?.price || 0;

  return (
    milkPrice +
    sizePrice +
    shotPrice +
    temperaturePrice +
    fillingPrice +
    toppingPrice +
    proteinPrice +
    cheesePrice +
    veggyPrice
  );
}

export function calculateCartItemTotal(params: {
  basePrice: number;
  quantity: number;
  customizationJson?: string;
}): number {
  const customization = parseCustomization(params.customizationJson);
  const customizationPrice = calculateCustomizationPrice(customization);
  const unitPrice = params.basePrice + customizationPrice;

  return unitPrice * params.quantity;
}
