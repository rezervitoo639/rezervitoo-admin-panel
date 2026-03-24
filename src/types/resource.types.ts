export interface Amenity {
  id: number;
  name: string;        // language-resolved display name (read-only from API)
  name_en: string;
  name_ar: string | null;
  name_fr: string | null;
  icon: string | null;
}

export interface Restriction {
  id: number;
  name: string;
  name_en: string;
  name_ar: string | null;
  name_fr: string | null;
  icon: string | null;
}

export interface Nearby {
  id: number;
  name: string;
  name_en: string;
  name_ar: string | null;
  name_fr: string | null;
  icon: string | null;
}

export interface BedType {
  id: number;
  name: string;
  name_en: string;
  name_ar: string | null;
  name_fr: string | null;
  icon?: string | null;
}
