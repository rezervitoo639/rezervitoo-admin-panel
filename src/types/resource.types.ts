export interface Amenity {
  id: number;
  name: string;
  icon: string | null;
}

export interface Restriction {
  id: number;
  name: string;
  icon: string | null;
}

export interface Nearby {
  id: number;
  name: string;
  icon: string | null;
}

export interface BedType {
  id: number;
  name: string;
  icon?: string | null;
}
