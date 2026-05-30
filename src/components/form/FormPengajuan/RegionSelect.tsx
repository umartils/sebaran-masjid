"use client";

import type { Region } from "@/lib/types";
import { ChevronDown } from "lucide-react";

interface RegionSelectProps {
  label: string;
  value: string;
  regions: Region[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

export default function RegionSelect({
  label,
  value,
  regions,
  disabled = false,
  onChange,
}: RegionSelectProps) {
  return (
    <label className="field">
      <span className="label">{label}</span>
      <div className="select-wrapper">
        <select
          className="control"
          required={label.includes("*")}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Pilih {label.replace("*", "")}</option>

          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
        <ChevronDown className="select-icon" size={18} />
      </div>
    </label>
  );
}