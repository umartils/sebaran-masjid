export type BuildingCondition = "RUSAK_BERAT" | "RUSAK_SEDANG" | "RUSAK_RINGAN" | "LAYAK";

export type Building = {
  id: string;
  name: string;
  address: string;
  provinceId: string;
  provinceName: string;
  regencyId: string;
  regencyName: string;
  districtId?: string | null;
  districtName?: string | null;
  villageId?: string | null;
  villageName?: string | null;
  latitude: number;
  longitude: number;
  condition: BuildingCondition;
  capacity?: number | null;
  establishedYear?: number | null;
  initialBudget?: string | number | null;
  currentArea?: string | null;
  mainMaterial?: string | null;
  expansionStatus?: string | null;
  renovationHistory?: string | null;
  expansionTarget?: string | null;
  landStatus?: string | null;
  notes?: string | null;
};

export type Region = {
  id: string;
  name: string;
};

