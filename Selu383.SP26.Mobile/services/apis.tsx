import {
  CategoryDto,
  CreateGuestOrderDto,
  CreateOrderDto,
  CreateOrderItemDto,
  CreatePaymentSheetDto,
  Location,
  LoginDto,
  MenuItemDto,
  PaymentSheetResponseDto,
  RegisterDto,
  RewardOfferingDto,
  UserRewardsDto,
} from "./types";
const API_BASE = "https://selu383-sp26-p03-g06.azurewebsites.net";

export async function getLocations() {
  const response = await fetch(`${API_BASE}/api/locations`);
  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.status}`);
  }
  const data = await response.json();
  return data as Location[];
}

export async function getLocationById(id: number) {
  const response = await fetch(`${API_BASE}/api/locations/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch location ${id}: ${response.status}`);
  }
  return response.json();
}

export async function loginUser(loginDto: LoginDto) {
  try {
    const response = await fetch(`${API_BASE}/api/authentication/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(loginDto),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid username or password");
      } else if (response.status === 400) {
        throw new Error("Invalid login credentials format");
      } else {
        throw new Error(`Login failed: ${response.status}`);
      }
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function signUpUser(registerDto: RegisterDto) {
  try {
    const response = await fetch(`${API_BASE}/api/authentication/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(registerDto),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Registration failed - unauthorized");
      } else if (response.status === 400) {
        throw new Error("Invalid registration data format");
      } else if (response.status === 409) {
        throw new Error("Username already exists");
      } else {
        throw new Error(`Registration failed: ${response.status}`);
      }
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_BASE}/api/authentication/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Not authenticated");
      } else {
        throw new Error(`Failed to get user info: ${response.status}`);
      }
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    throw error;
  }
}

export async function logoutUser() {
  try {
    const userData = await getCurrentUser();
    if (!userData) {
      throw new Error("Not authenticated");
    }
    const response = await fetch(`${API_BASE}/api/authentication/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Logout failed: ${response.status}`);
    }
    return true;
  } catch (error) {
    throw error;
  }
}

export async function getMenuItems() {
  const response = await fetch(`${API_BASE}/api/menu-items`);
  if (!response.ok) {
    throw new Error(`Failed to fetch menu items: ${response.status}`);
  }
  const data = await response.json();
  return data as MenuItemDto[];
}

export async function getCategory() {
  const response = await fetch(`${API_BASE}/api/categories`);
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }
  const data = await response.json();
  return data as CategoryDto[];
}

export async function createOrder(
  locationId: number,
  orderItems: CreateOrderItemDto[],
  checkout: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    rewardOfferingId?: number;
    rewardedMenuItemId?: number | null;
  },
) {
  try {
    const body: CreateOrderDto = {
      locationId,
      checkoutFirstName: checkout.firstName,
      checkoutLastName: checkout.lastName,
      checkoutEmail: checkout.email,
      checkoutPhoneNumber: checkout.phoneNumber,
      orderItems,
      rewardOfferingId: checkout.rewardOfferingId,
      rewardedMenuItemId: checkout.rewardedMenuItemId,
    };
    const response = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
export async function createGuestOrder(
  createGuestOrderDto: CreateGuestOrderDto,
) {
  try {
    const response = await fetch(`${API_BASE}/api/orders/guest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(createGuestOrderDto),
    });

    if (!response.ok) {
      throw new Error(`Failed to create guest order: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getRewardOfferings() {
  try {
    const response = await fetch(`${API_BASE}/api/Rewards/offerings`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reward offerings: ${response.status}`);
    }

    const data = await response.json();
    return data as RewardOfferingDto[];
  } catch (error) {
    throw error;
  }
}

export async function getMyRewards() {
  try {
    const response = await fetch(`${API_BASE}/api/Rewards/me`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Not authenticated");
      }
      throw new Error(`Failed to fetch user rewards: ${response.status}`);
    }
    const data = await response.json();
    return data as UserRewardsDto;
  } catch (error) {
    throw error;
  }
}

export async function createPaymentSheet(
  dto: CreatePaymentSheetDto,
): Promise<PaymentSheetResponseDto> {
  const response = await fetch(
    `${API_BASE}/api/payments/create-payment-sheet`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dto),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to create payment sheet: ${response.status}`);
  }

  return response.json();
}
export async function getMyProfile() {
  const response = await fetch(`${API_BASE}/api/users/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load profile");
  }

  return response.json();
}

export async function getMyOrders() {
  const response = await fetch(`${API_BASE}/api/users/me/orders`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log("GET MY ORDERS STATUS:", response.status);
    console.log("GET MY ORDERS ERROR:", errorText);

    throw new Error("Failed to load previous orders");
  }

  return response.json();
}

export async function updateMyProfile(profileData: {
  email?: string;
  phoneNumber?: string;
  address?: string;
  preferredLocationId?: number | null;
}) {
  const response = await fetch(`${API_BASE}/api/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
}

export async function getPickupTimes(locationId: number) {
  const response = await fetch(
    `${API_BASE}/api/locations/${locationId}/pickup-times`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to load pickup times");
  }

  return response.json();
}

export async function redeemReward(rewardOfferingId: number) {
  const response = await fetch(`${API_BASE}/api/rewards/redeem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ rewardOfferingId }),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "Failed to redeem reward");
  }

  return JSON.parse(text);
}

export async function getMyRewardRedemptions() {
  const response = await fetch(`${API_BASE}/api/rewards/redemptions/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load reward redemptions");
  }

  return response.json();
}
