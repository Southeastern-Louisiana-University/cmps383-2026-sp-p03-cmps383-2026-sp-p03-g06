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
