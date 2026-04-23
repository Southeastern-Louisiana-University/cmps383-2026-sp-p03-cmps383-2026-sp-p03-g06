export interface Location {
  id: number;
  name: string;
  address: string;
  tableCount: number;
  managerId?: number | null;
  hoursOfOperation?: string | null;
}

// Drink customization types
export type MilkType = "whole" | "skim" | "oat" | "almond" | "soy" | "none";
export type DrinkSize = "small" | "medium" | "large";
export type ShotOption = 0 | 1 | 2 | 3 | 4 | 5;
export type TemperatureOption = "hot" | "warm" | "chilled";
export type FillingOption =
  | "none"
  | "chocolate"
  | "strawberry"
  | "vanilla"
  | "caramel";
export type ToppingOption =
  | "none"
  | "whippedCream"
  | "powderedSugar"
  | "freshFruit";
export type ProteinOption = "none" | "bacon" | "ham" | "egg";
export type CheeseOption = "none" | "cheddar" | "swiss" | "provolone";
export type VeggyOption = "none" | "spinach" | "mushroom" | "tomato";

export interface DrinkCustomization {
  milkType?: MilkType;
  drinkSize?: DrinkSize;
  shotCount?: ShotOption;
  temperature?: TemperatureOption;
  filling?: FillingOption;
  topping?: ToppingOption;
  protein?: ProteinOption;
  cheese?: CheeseOption;
  veggy?: VeggyOption;
  addOns?: string[];
}

export interface SearchLocationProps {
  visible: boolean;
  onClose: () => void;
}

export interface LoginDto {
  userName: string;
  password: string;
}

export interface RegisterDto {
  userName: string;
  password: string;
}

export interface OrderDto {
  id: number;
  locationId: number;
  orderItems: OrderItemsDto[];
}

export interface OrderItemsDto {
  id: number;
  menuItemId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface MenuItemDto {
  id: number;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  categoryId: number;
}

export interface CategoryDto {
  id: number;
  name: string;
}

export interface CreateOrderDto {
  locationId: number;
  checkoutFirstName: string;
  checkoutLastName: string;
  checkoutEmail: string;
  checkoutPhoneNumber: string;
  orderItems: CreateOrderItemDto[];
}
export interface CreateGuestOrderDto {
  checkoutFirstName: string;
  checkoutLastName: string;
  checkoutEmail: string;
  checkoutPhoneNumber: string;
  locationId: number;
  orderItems: CreateOrderItemDto[];
}

export interface CreateOrderItemDto {
  menuItemId: number;
  quantity: number;
  customizationJson?: string;
}

export interface RewardOfferingDto {
  id: number;
  name: string;
  description: string;
  pointsRequired: number;
  isActive: boolean;
}

export interface UserRewardsDto {
  id: string;
  userName: string;
  rewardPoints: number;
}
