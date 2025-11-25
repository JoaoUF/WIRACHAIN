export const MIN_AGE = 18;

export const GENDERS = [
  { label: "Prefer not to say", value: "NONE" },
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Custom", value: "CUSTOM" },
];

export const COUNTRY_CODES = [
  { label: "+51 (Peru)", value: "51" },
  { label: "+1 (USA)", value: "1" },
  { label: "+44 (UK)", value: "44" },
];

export const DOC_TYPES = [
  { label: "DNI", value: "01" }, // expects length 8
  { label: "RUC", value: "04" }, // expects length 12
  { label: "CE", value: "06" }, // expects length 11
  { label: "Passport", value: "07" }, // expects length 12
];

export const DOC_TYPE_LENGTHS: Record<string, number> = {
  "01": 8,
  "04": 12,
  "06": 11,
  "07": 12,
};
