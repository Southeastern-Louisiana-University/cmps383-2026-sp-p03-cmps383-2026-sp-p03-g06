import { Location, LoginDto } from "./types";
const API_BASE = "https://selu383-sp26-p03-g06.azurewebsites.net";

export async function getLocations() {
  const response = await fetch(`${API_BASE}/api/locations`);
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
