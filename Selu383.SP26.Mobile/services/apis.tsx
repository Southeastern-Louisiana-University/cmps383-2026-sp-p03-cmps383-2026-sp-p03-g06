import { Location } from "./types";
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
