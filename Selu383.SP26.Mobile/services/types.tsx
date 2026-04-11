export interface Location {
  id: number;
  name: string;
  address: string;
  tableCount: number;
  managerId?: number | null;
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
  price: number;
  totalPrice: number;
}

export interface CreateOrderDto {
  locationId: number;
  orderItems: { menuItemId: number; quantity: number }[];
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
